using BuildingBlocks.Auth.Enums;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Data;

public class InitialData
{
    public static IEnumerable<User> Users =>
        new List<User>
        {
            new()
            {
                Id = Guid.Parse("1405b4db-78db-43cd-91d2-a29f01a416f1"),
                PhoneNumber = "0000000000",
                Password = "AQAAAAIAAYagAAAAEKA4DsZYn42UL8FWDgHf2E73jkVB9qe4+FDc2quCVz9IkQEtZ+3SLqrRWGM57yp8Wg==",
                Role = UserRole.Admin,
            }
        };
}
