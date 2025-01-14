using BuildingBlocks.Auth.Enums;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetCurrentWeekRegisterStatistics;

internal sealed class GetWeekRegisterStatisticsHandler(
    IUserRepository _userRepository) : IQueryHandler<GetWeekRegisterStatisticsQuery, GetWeekRegisterStatisticsResult>
{
    public async Task<GetWeekRegisterStatisticsResult> Handle(GetWeekRegisterStatisticsQuery query, CancellationToken cancellationToken)
    {
        var startOfWeek = StartOfWeek(query.CurrentDate, DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var userRegistrations = await _userRepository.GetUsersAsync(
            u => u.RegisteredAt >= startOfWeek && u.RegisteredAt < endOfWeek
        );

        var groupedRegistrations = userRegistrations.Data
            .GroupBy(u => u.RegisteredAt.Date)
            .Select(g => new DayUserRegisterDto
            {
                Date = g.Key,
                NumberOfBrands = g.Count(u => u.Role == UserRole.Brand),
                NumberOfPlayers = g.Count(u => u.Role == UserRole.Player)
            })
            .ToList();

        return new GetWeekRegisterStatisticsResult(groupedRegistrations);
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
