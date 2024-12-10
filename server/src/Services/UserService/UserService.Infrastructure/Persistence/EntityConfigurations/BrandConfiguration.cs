using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Domain.Entities;
using UserService.Infrastructure.Persistence.Constants;

namespace UserService.Infrastructure.Persistence.EntityConfigurations;

internal sealed class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder
            .ToTable(TableNames.Brands)
            .HasKey(u => u.UserId);

        builder
            .HasOne(b => b.User)
            .WithOne(u => u.Brand)
            .HasForeignKey<Brand>(b => b.UserId);
    }
}
