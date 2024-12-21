namespace GameService.API.Entities;

public class Question
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<QuestionOption> Options { get; set; } = new();
}
