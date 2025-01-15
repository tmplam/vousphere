"use client";
import { BrandGameVouchersStatistics } from "@/app/(subsystem)/counterpart/(statistics)/bar-charts";
import OverviewStatistics from "@/app/(subsystem)/counterpart/(statistics)/overview-statistics";
import { CounterpartEventStatusStatistics } from "@/app/(subsystem)/counterpart/(statistics)/week-vouchers";
import { CounterpartWeeklyIssuedVouchers } from "@/app/(subsystem)/counterpart/(statistics)/weekly-issured-voucher";

export default function DashboardPage() {
    return (
        <div className="overflow-hidden">
            <OverviewStatistics />
            <div className="pt-4">
                <h3 className="text-2xl text-gradient font-semibold">Voucher Statistics</h3>
                <div className="py-2">
                    <CounterpartEventStatusStatistics />
                </div>
                <div className="py-2">
                    <CounterpartWeeklyIssuedVouchers />
                </div>
                <div className="w-full mx-auto pt-3">
                    <BrandGameVouchersStatistics />
                </div>
            </div>
        </div>
    );
}
