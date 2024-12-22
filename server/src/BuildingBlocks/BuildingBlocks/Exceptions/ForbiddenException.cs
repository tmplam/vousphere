namespace BuildingBlocks.Exceptions;

public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "Forbidden resource") : base(message)
    {
    }

    public ForbiddenException(string message, string details) : base(message)
    {
        Details = details;
    }

    public string? Details { get; }
}
