namespace GameService.API.Dtos;

public class QuestionOptionDto
{
    public Guid? Id { get; set; } = null;
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; } = false;
}
