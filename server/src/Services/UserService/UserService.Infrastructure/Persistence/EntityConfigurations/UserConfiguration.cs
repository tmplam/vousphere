using BuildingBlocks.Auth.Abstractions.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Domain.Entities;
using UserService.Domain.Enums;
using UserService.Infrastructure.Persistence.Constants;

namespace UserService.Infrastructure.Persistence.EntityConfigurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .ToTable(TableNames.Users)
            .HasKey(u => u.Id);

        builder.HasIndex(u => u.Phone).IsUnique();

        builder
            .Property(u => u.Status)
            .HasConversion(
                status => status.ToString(),
                status => TryParseUserStatus(status));

        builder
            .Property(u => u.Role)
            .HasConversion(
                role => role.ToString(),
                role => TryParseUserRole(role));
    }

    private static UserRole TryParseUserRole(string role)
    {
        return Enum.TryParse<UserRole>(role, true, out var parsedRole)
            ? parsedRole
            : UserRole.Player;
    }

    private static UserStatus TryParseUserStatus(string status)
    {
        return Enum.TryParse<UserStatus>(status, true, out var parsedStatus)
            ? parsedStatus
            : UserStatus.Blocked;
    }
}
