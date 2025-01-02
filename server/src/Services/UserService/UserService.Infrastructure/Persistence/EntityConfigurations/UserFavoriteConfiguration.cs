using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Domain.Entities;
using UserService.Infrastructure.Persistence.Constants;

namespace UserService.Infrastructure.Persistence.EntityConfigurations;

internal sealed class UserFavoriteConfiguration : IEntityTypeConfiguration<UserFavorite>
{
    public void Configure(EntityTypeBuilder<UserFavorite> builder)
    {
        builder
            .ToTable(TableNames.UserFavorites)
            .HasKey(uf => uf.Id);

        builder.HasIndex(uf => uf.EventId);

        builder
            .HasOne(uf => uf.User)
            .WithMany(u => u.UserFavorites)
            .HasForeignKey(uf => uf.UserId);
    }
}
