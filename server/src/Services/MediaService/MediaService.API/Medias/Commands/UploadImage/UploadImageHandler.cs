using MediaService.API.Services;

namespace MediaService.API.Medias.Commands.UploadImage;

public record class UploadImageCommand(IFormFile File) : ICommand<UploadImageResult>;
public record UploadImageResult(Guid ImageId);


public class UploadImageHandler(
    IDocumentSession session,
    IFileStorageService fileStorageService) : ICommandHandler<UploadImageCommand, UploadImageResult>
{
    public async Task<UploadImageResult> Handle(UploadImageCommand command, CancellationToken cancellationToken)
    {
        var imageUrl = await fileStorageService.SaveFileAsync(command.File);

        var media = new Media
        {
            Id = Guid.NewGuid(),
            Url = imageUrl
        };

        session.Store(media);
        await session.SaveChangesAsync();

        return new UploadImageResult(media.Id);
    }
}
