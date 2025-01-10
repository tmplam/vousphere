namespace GameService.API.Dtos;

public class QuizScoresDto
{
    public Dictionary<Guid, Dictionary<int, int>> Scores { get; set; } = new();
}
