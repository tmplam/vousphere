using Marten.Pagination;

namespace GameService.API.Features.Quizzes.Queries.GetQuizzes;

public record GetQuizzesQuery(int Page = 1, int PerPage = 10, bool IncludeQuestions = false) : IQuery<GetQuizzesResult>;
public record GetQuizzesResult(PaginationResult<Quiz> Quizzes);


public class GetQuizzesHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : IQueryHandler<GetQuizzesQuery, GetQuizzesResult>
{
    public async Task<GetQuizzesResult> Handle(GetQuizzesQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(claimService.GetUserId());

        var quizzes = await session.Query<Quiz>()
            .Where(q => q.BrandId == brandId)
            .ToPagedListAsync(query.Page, query.PerPage, cancellationToken);

        if (!query.IncludeQuestions)
        {
            foreach (var quiz in quizzes)
            {
                quiz.Questions = null!;
            }
        }

        return new GetQuizzesResult(
            new PaginationResult<Quiz>(
                quizzes.PageNumber, 
                quizzes.PageSize, 
                quizzes.TotalItemCount, 
                quizzes.PageCount, 
                quizzes));
    }
}
