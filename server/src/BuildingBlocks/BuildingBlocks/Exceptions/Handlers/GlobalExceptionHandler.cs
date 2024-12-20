using BuildingBlocks.Shared;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace BuildingBlocks.Exceptions.Handlers;


public class GlobalExceptionhandler(ILogger<GlobalExceptionhandler> _logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not ValidationException)
            _logger.LogError("Error Message: {exceptionMessage}, Time of occurrence {time}", exception.Message, DateTime.UtcNow);

        (string Message, string Title, int StatusCode) details = exception switch
        {
            InternalServerException =>
            (
                exception.Message,
                exception.GetType().Name,
                context.Response.StatusCode = StatusCodes.Status500InternalServerError
            ),
            ValidationException =>
            (
                exception.Message,
                exception.GetType().Name,
                context.Response.StatusCode = StatusCodes.Status422UnprocessableEntity
            ),
            BadRequestException =>
            (
                exception.Message,
                exception.GetType().Name,
                context.Response.StatusCode = StatusCodes.Status400BadRequest
            ),
            NotFoundException =>
            (
                exception.Message,
                exception.GetType().Name,
                context.Response.StatusCode = StatusCodes.Status404NotFound
            ),
            _ =>
            (
                exception.Message,
                exception.GetType().Name,
                context.Response.StatusCode = StatusCodes.Status500InternalServerError
            )
        };

        var problemDetails = ApiResult.Failure(details.Message, details.StatusCode);

        if (exception is ValidationException validationException)
        {
            problemDetails.ValidationErrors = validationException.Errors
                .GroupBy(error => error.PropertyName)
                .Select(group => new ValidationError
                {
                    PropertyName = group.Key,
                    ErrorMessage = group.Select(error => error.ErrorMessage).ElementAt(0)
                });
        }

        await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}