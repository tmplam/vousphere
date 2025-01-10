namespace GameService.API.Dtos;

public class QuizAnswerScoreDto
{
    public int QuestionIndex { get; set; }
    public int CorrectOptionIndex { get; set; }
    public int Score { get; set; }
}
