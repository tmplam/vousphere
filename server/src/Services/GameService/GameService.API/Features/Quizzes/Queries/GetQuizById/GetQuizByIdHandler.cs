namespace GameService.API.Features.Quizzes.Queries.GetQuizById;

public record GetQuizByIdQuery(Guid Id) : IQuery<GetQuizByIdResult>;
public record GetQuizByIdResult(Quiz Quiz);


public class GetQuizByIdHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : IQueryHandler<GetQuizByIdQuery, GetQuizByIdResult>
{
    public async Task<GetQuizByIdResult> Handle(GetQuizByIdQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(claimService.GetUserId());

        var quiz = await session.LoadAsync<Quiz>(query.Id);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        if (quiz.BrandId != brandId) throw new ForbiddenException();

        return new GetQuizByIdResult(quiz);
    }
}
