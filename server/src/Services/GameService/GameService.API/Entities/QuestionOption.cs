namespace GameService.API.Entities;

public class QuestionOption
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; } = false;
}
