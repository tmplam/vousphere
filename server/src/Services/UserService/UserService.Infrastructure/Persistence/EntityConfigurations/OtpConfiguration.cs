using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.EntityConfigurations;

internal sealed class OtpConfiguration : IEntityTypeConfiguration<Otp>
{
    public void Configure(EntityTypeBuilder<Otp> builder)
    {
        builder
            .ToTable("Otps")
            .HasKey(o => o.Id);

        builder.HasIndex(o => o.UserId);

        builder
            .HasOne(o => o.User)
            .WithMany(u => u.Otps)
            .HasForeignKey(o => o.UserId);

        builder
            .Property(o => o.Code)
            .IsRequired()
            .HasColumnType("nvarchar(6)");

        builder
            .Property(o => o.ExpiresAt)
            .IsRequired();
    }
}
