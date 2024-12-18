namespace EventService.API.Entities;

public class Item
{
    public Guid Id { get; set; }
    public string Image { get; set; } = string.Empty;
    public int NumberPieces { get; set; }

    public List<ItemPiece> ItemPieces { get; set; } = new();
}
