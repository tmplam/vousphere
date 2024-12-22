namespace GameService.API.Features.Quizzes.Queries.GetQuizQuestionById;

public record GetQuizQuestionByIdQuery(Guid QuizId, Guid QuestionId) : IQuery<GetQuizQuestionByIdResult>;
public record GetQuizQuestionByIdResult(Question Question);


public class GetQuizQuestionByIdHandler(
    IDocumentSession session)
    : IQueryHandler<GetQuizQuestionByIdQuery, GetQuizQuestionByIdResult>
{
    public async Task<GetQuizQuestionByIdResult> Handle(GetQuizQuestionByIdQuery query, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(query.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var question = quiz.Questions.FirstOrDefault(q => q.Id == query.QuestionId);

        if (question == null) throw new NotFoundException("Question not found");

        return new GetQuizQuestionByIdResult(question);
    }
}
