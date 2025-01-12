namespace BuildingBlocks.Http.Dtos.Events;

public class ItemInfoDto
{
    public Guid ImageId { get; set; }
    public string Image { get; set; } = string.Empty;
    public int NumberPieces { get; set; }
}
