using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace MediaService.API.Services;

public class AzureFileStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;

    public AzureFileStorageService(string connectionString)
    {
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<string> SaveFileAsync(IFormFile file, string containerName = "images")
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

        var blobClient = containerClient.GetBlobClient(Guid.NewGuid().ToString());
        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }

    public async Task RemoveFileAsync(string fileUrl, string containerName = "images")
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobName = Path.GetFileName(fileUrl);
        var blobClient = containerClient.GetBlobClient(blobName);
        await blobClient.DeleteIfExistsAsync();
    }
}
