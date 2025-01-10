namespace GameService.API.Dtos;

public class QuestionInfoDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public List<OptionInfoDto> Options { get; set; } = new();
}
