namespace MediaService.API.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile filem, string containerName = "images");
    Task RemoveFileAsync(string fileUrl, string containerName = "images");
}
