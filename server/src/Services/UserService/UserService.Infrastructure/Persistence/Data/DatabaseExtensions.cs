using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace UserService.Infrastructure.Persistence.Data;

public static class DatabaseExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();

        await SeedUserAsync(context);
    }

    private static async Task SeedUserAsync(ApplicationDbContext context)
    {
        foreach (var user in InitialData.Users)
        {
            if (!await context.Users.AnyAsync(u => u.Id == user.Id))
            {
                await context.Users.AddAsync(user);
            }
        }
        await context.SaveChangesAsync();
    }
}
