namespace GameService.API.Dtos;

public class QuestionOptionDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; } = false;
}
