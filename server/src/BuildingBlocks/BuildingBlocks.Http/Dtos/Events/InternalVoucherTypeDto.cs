namespace BuildingBlocks.Http.Dtos.Events;

public class InternalVoucherTypeDto
{
    public Guid Id { get; set; }
    public double Discount { get; set; }
    public int Total { get; set; }
    public int Remaining { get; set; }
}
