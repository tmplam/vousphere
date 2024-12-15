using Microsoft.AspNetCore.Http;

namespace BuildingBlocks.Shared;

public class ApiResult
{
    private ApiResult() { }

    public int StatusCode { get; set; }
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; } = null;
    public IEnumerable<ValidationError>? ValidationErrors { get; set; } = null;

    public static ApiResult Success(object? data = null, string message = "Operation successful", int statusCode = StatusCodes.Status200OK) => 
        new ApiResult
        {
            StatusCode = statusCode,
            IsSuccess = true,
            Message = message,
            Data = data
        };

    public static ApiResult Failure(string message = "Operation failed", int statusCode = StatusCodes.Status400BadRequest, IEnumerable<ValidationError>? validationErrors = null) =>
        new ApiResult
        {
            StatusCode = statusCode,
            IsSuccess = false,
            Message = message,
            ValidationErrors = validationErrors
        };
}

public class ValidationError
{
    public string PropertyName { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;
}