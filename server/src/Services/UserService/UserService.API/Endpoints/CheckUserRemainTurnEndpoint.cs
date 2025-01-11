using UserService.Application.Features.Users.Queries.CheckUserRemainTurn;

namespace UserService.API.Endpoints;

public class CheckUserRemainTurnEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/{userId:guid}/check-remain-turn", async (
            Guid userId,
            ISender sender) =>
        {
            var query = new CheckUserRemainTurnQuery(userId);

            var result = await sender.Send(query);

            return Results.Ok(result);
        });    
    }
}
