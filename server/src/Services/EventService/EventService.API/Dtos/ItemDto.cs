namespace EventService.API.Dtos;

public class ItemDto
{
    public Guid ImageId { get; set; }
    public string Image { get; set; } = string.Empty;
    public int NumberPieces { get; set; }
}
