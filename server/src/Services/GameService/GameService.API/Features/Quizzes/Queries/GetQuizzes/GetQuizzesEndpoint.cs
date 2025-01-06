namespace GameService.API.Features.Quizzes.Queries.GetQuizzes;

public record GetQuizzesRequest(int Page = 1, int PerPage = 10, bool IncludeQuestions = false);
public record GetQuizzesResponse(PaginationResult<Quiz> Quizzes);


public class GetQuizzesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/quizzes", async ([AsParameters] GetQuizzesRequest request, [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetQuizzesQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetQuizzesResponse>();

            return Results.Ok(ApiResult.Success(response.Quizzes));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
