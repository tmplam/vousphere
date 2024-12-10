using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Domain.Entities;
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
    }
}
