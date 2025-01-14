using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetCurrentWeekRegisterStatistics;

public record GetWeekRegisterStatisticsQuery(DateTimeOffset CurrentDate) : IQuery<GetWeekRegisterStatisticsResult>;
public record GetWeekRegisterStatisticsResult(List<DayUserRegisterDto> WeekRegisters);
