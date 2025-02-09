﻿using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Shared;
using Marten.Pagination;
using VoucherService.API.Enums;

namespace VoucherService.API.Vouchers.Queries.GetUserVouchers;

public record GetUserVouchersQuery(
    int Page = 1,
    int PerPage = 10) : IQuery<GetUserVouchersResult>;
public record GetUserVouchersResult(PaginationResult<Voucher> Vouchers);

public class GetUserVouchersHandler(
    IDocumentSession _session,
    IClaimService _claimService) : IQueryHandler<GetUserVouchersQuery, GetUserVouchersResult>
{
    public async Task<GetUserVouchersResult> Handle(GetUserVouchersQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var vouchers = await _session.Query<Voucher>()
            .Where(v => 
                v.OwnerId == userId &&
                v.Status == VoucherStatus.Active &&
                v.ExpiredAt > DateTimeOffset.UtcNow)
            .OrderByDescending(v => v.IssuedAt)
            .ToPagedListAsync(query.Page, query.PerPage, cancellationToken);

        return new GetUserVouchersResult(
            PaginationResult<Voucher>.Create(
                vouchers.PageNumber,
                vouchers.PageSize,
                vouchers.TotalItemCount,
                vouchers.PageCount,
                vouchers));
    }
}
