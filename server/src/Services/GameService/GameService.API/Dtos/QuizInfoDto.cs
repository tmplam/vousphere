namespace GameService.API.Dtos;

public class QuizInfoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<QuestionInfoDto> Questions { get; set; } = new List<QuestionInfoDto>();
}
