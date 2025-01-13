using BuildingBlocks.Auth.Enums;
using UserService.Domain.Entities;
using UserService.Domain.Enums;

namespace UserService.Infrastructure.Persistence.Data;

public class InitialData
{
    public static IEnumerable<User> Users =>
        new List<User>
        {
            // Admins
            new()
            {
                Id = Guid.Parse("1405b4db-78db-43cd-91d2-a29f01a416f1"),
                PhoneNumber = "0000000000",
                Name = "Admin",
                Email = "admin@gmail.com",
                Password = "AQAAAAIAAYagAAAAEKA4DsZYn42UL8FWDgHf2E73jkVB9qe4+FDc2quCVz9IkQEtZ+3SLqrRWGM57yp8Wg==",
                Role = UserRole.Admin,
                Status = UserStatus.Verified,
            },

            // Brands
            new()
            {
                Id = Guid.Parse("c06f7346-a6d3-434f-82c8-7085cde815d4"),
                PhoneNumber = "0927364732",
                Email = "mixue@gmail.com",
                Name = "Mixue",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Brand,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/01/2025 2:30:00 PM +00:00"),
                ImageId = Guid.Parse("8352f82d-7abe-42bc-84cd-9ee0f440b218"),
                Brand = new Brand
                {
                    UserId = Guid.Parse("c06f7346-a6d3-434f-82c8-7085cde815d4"),
                    Latitude = 10.762622,
                    Longitude = 106.660172,
                    Address = "123 Nguyễn Văn A, Phường An Đới, Quận 12, TP.HCM",
                    Domain = "Drink",
                }
            },
            new()
            {
                Id = Guid.Parse("0c10db47-6775-469b-b968-cb838cc8b049"),
                PhoneNumber = "0983727845",
                Email = "phuclong@gmail.com",
                Name = "Phúc Long",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Brand,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/15/2025 2:30:00 PM +00:00"),
                ImageId = Guid.Parse("2fa35a3a-8f70-45a5-b4ea-5d3515efd778"),
                Brand = new Brand
                {
                    UserId = Guid.Parse("0c10db47-6775-469b-b968-cb838cc8b049"),
                    Latitude = 10.762622,
                    Longitude = 106.660172,
                    Address = "123 Phan Văn Trị, Phường 10, Quận Gò Vấp, TP.HCM",
                    Domain = "Drink",
                }
            },
            new()
            {
                Id = Guid.Parse("eaae1393-b4ba-4528-af6c-970aa4b4eb1b"),
                PhoneNumber = "0782736251",
                Email = "tocotoco@gmail.com",
                Name = "Toco Toco",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Brand,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/14/2025 2:30:00 PM +00:00"),
                ImageId = Guid.Parse("8c10c679-be90-4f33-977b-26eb9b3deffd"),
                Brand = new Brand
                {
                    UserId = Guid.Parse("eaae1393-b4ba-4528-af6c-970aa4b4eb1b"),
                    Latitude = 10.762622,
                    Longitude = 106.660172,
                    Address = "123 Nguyễn Văn A, Phường An Đới, Quận 12, TP.HCM",
                    Domain = "Drink",
                }
            },
            new()
            {
                Id = Guid.Parse("8501d061-1039-4272-824d-950e8f54ef3c"),
                PhoneNumber = "0726352423",
                Email = "halidao@gmail.com",
                Name = "Halidao",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Brand,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/02/2025 2:30:00 PM +00:00"),
                ImageId = Guid.Parse("5010f869-0b73-4870-bdc0-f25a81ad3483"),
                Brand = new Brand
                {
                    UserId = Guid.Parse("8501d061-1039-4272-824d-950e8f54ef3c"),
                    Latitude = 10.762622,
                    Longitude = 106.660172,
                    Address = "123 Nguyễn Văn A, Phường An Đới, Quận 12, TP.HCM",
                    Domain = "Drink",
                }
            },
            new()
            {
                Id = Guid.Parse("aa5ed6f1-a104-425d-b423-24b4b403d86a"),
                PhoneNumber = "0928273713",
                Email = "bobapop@gmail.com",
                Name = "BoBa PoP",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Brand,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/13/2025 2:30:00 PM +00:00"),
                ImageId = Guid.Parse("be3220d5-bb24-4b82-8763-164415bd1834"),
                Brand = new Brand
                {
                    UserId = Guid.Parse("aa5ed6f1-a104-425d-b423-24b4b403d86a"),
                    Latitude = 10.762622,
                    Longitude = 106.660172,
                    Address = "123 Nguyễn Văn A, Phường An Đới, Quận 12, TP.HCM",
                    Domain = "Drink",
                }
            },

            // Players 
            new()
            {
                Id = Guid.Parse("ce7739d6-039c-4d05-be39-d263893a880b"),
                PhoneNumber = "0917263542",
                Email = "tranmyphulam@gmail.com",
                Name = "Phú Lâm",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Player,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/13/2025 2:30:00 PM +00:00"),
                Player = new Player
                {
                    UserId = Guid.Parse("ce7739d6-039c-4d05-be39-d263893a880b"),
                    Gender = "Male",
                    DateOfBirth = DateOnly.Parse("01/02/2000"),
                    NumberOfPlays = 10,
                }
            },
            new()
            {
                Id = Guid.Parse("afce9a8e-5dd9-4bd9-8f1e-17e65b4a868e"),
                PhoneNumber = "0909828232",
                Email = "doanduchuu@gmail.com",
                Name = "Đức Hữu",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Player,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/13/2025 2:30:00 PM +00:00"),
                Player = new Player
                {
                    UserId = Guid.Parse("afce9a8e-5dd9-4bd9-8f1e-17e65b4a868e"),
                    Gender = "Male",
                    DateOfBirth = DateOnly.Parse("03/20/2003"),
                    NumberOfPlays = 10,
                }
            },
            new()
            {
                Id = Guid.Parse("e062889a-54c9-446e-86e8-348747e7f88e"),
                PhoneNumber = "0876576542",
                Email = "damhonghung@gmail.com",
                Name = "Hi Hi",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Player,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/14/2025 2:30:00 PM +00:00"),
                Player = new Player
                {
                    UserId = Guid.Parse("e062889a-54c9-446e-86e8-348747e7f88e"),
                    Gender = "Male",
                    DateOfBirth = DateOnly.Parse("03/20/2003"),
                    NumberOfPlays = 10,
                }
            },
            new()
            {
                Id = Guid.Parse("02002f8d-0547-4e97-9e9c-25c4baddc41d"),
                PhoneNumber = "0918212131",
                Email = "vuonghuynhkhai@gmail.com",
                Name = "Khải Zua",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Player,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/15/2025 2:30:00 PM +00:00"),
                Player = new Player
                {
                    UserId = Guid.Parse("02002f8d-0547-4e97-9e9c-25c4baddc41d"),
                    Gender = "Male",
                    DateOfBirth = DateOnly.Parse("03/20/2003"),
                    NumberOfPlays = 10,
                }
            },
            new()
            {
                Id = Guid.Parse("57d11cd7-f0c2-4037-8878-b6bb72eabf74"),
                PhoneNumber = "0918212131",
                Email = "tangocduykhiem@gmail.com",
                Name = "Khiêm Tạ",
                Password = "AQAAAAIAAYagAAAAEBsFtka2YiHKs1id1xqiVjhoQEjbYSSHXeh4Ne0Bh7pUJ5DcBi41jlcibDEDOyqFcQ==",
                Role = UserRole.Player,
                Status = UserStatus.Verified,
                RegisteredAt = DateTimeOffset.Parse("01/13/2025 2:30:00 PM +00:00"),
                Player = new Player
                {
                    UserId = Guid.Parse("57d11cd7-f0c2-4037-8878-b6bb72eabf74"),
                    Gender = "Male",
                    DateOfBirth = DateOnly.Parse("03/20/2003"),
                    NumberOfPlays = 10,
                }
            },
        };
}
