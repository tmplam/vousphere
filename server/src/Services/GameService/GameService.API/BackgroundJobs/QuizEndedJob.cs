using BuildingBlocks.Shared.Constants;
using GameService.API.Hubs;
using GameService.API.Services;
using GameService.API.Utilities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Quartz;
using System.Text.Json;

namespace GameService.API.BackgroundJobs;

public class QuizEndedJob(
    ILogger<QuizEndedJob> _logger,
    IDistributedCache _cache,
    IVoucherService _voucherService,
    IHubContext<QuizGameHub, IQuizGameClient> _hubContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event id is missing in SendQuizAnswerJob data.");
            return;
        }

        // Send the end of the quiz event to all clients in the quiz group
        var scoresKey = RedisCacheKeys.EventQuizScoresKey(eventId);
        var scoresString = await _cache.GetStringAsync(scoresKey);
        var scores = string.IsNullOrEmpty(scoresString)
            ? new QuizScoresDto()
            : JsonSerializer.Deserialize<QuizScoresDto>(scoresString)!;

        // Calculate total score for each user
        var totalScores = scores.Scores
            .Select(userScores => new
            {
                UserId = userScores.Key,
                TotalScore = userScores.Value.Values.Sum()
            })
            .OrderByDescending(user => user.TotalScore)
            .ToList();

        // Distribute vouchers based on a ratio
        var totalParticipants = totalScores.Count;
        double voucherDistributionRatio;

        if (totalParticipants <= 20)
            voucherDistributionRatio = 0.5;
        else if (totalParticipants <= 50)
            voucherDistributionRatio = 0.3;
        else
            voucherDistributionRatio = 0.1;

        var numberOfVouchers = (int)Math.Ceiling(totalParticipants * voucherDistributionRatio);
        var usersToReceiveVouchers = totalScores.Take(numberOfVouchers).Select(u => u.UserId).ToList();
        var lostUsers = totalScores.Skip(numberOfVouchers).ToList();

        // Give vouchers to selected users
        var voucherList = await _voucherService.DistributeVoucherListAsync(
            eventId,
            GameIdentifiers.QuizGameId,
            usersToReceiveVouchers);

        // Send the end of the quiz event to all clients in the quiz group
        var tasks = usersToReceiveVouchers.Select((userId, i) =>
        {
            var userIdString = userId.ToString();
            var index = i;
            return _hubContext.Clients.Users(userIdString).ReceiveQuizResult(voucherList[index].Discount, voucherList[index].PieceIndex);
        }).ToList();

        var lostUsersTask = _hubContext.Clients.Users(lostUsers.Select(u => u.UserId.ToString())).ReceiveQuizResult();
        tasks.Add(lostUsersTask);

        await Task.WhenAll(tasks);
    }
}
