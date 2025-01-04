namespace UserService.Application.Features.Users.Commands.UpdateBrandInfo;

public record UpdateBrandInfoCommand(
    Guid BrandId,
    double Latitude,
    double Longitude,
    string Address,
    string Domain) : ICommand<UpdateBrandInfoResult>;
public record UpdateBrandInfoResult();