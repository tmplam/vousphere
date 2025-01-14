"use client";
import OverviewStatistics from "@/app/(subsystem)/counterpart/(statistics)/overview-statistics";
import { CounterpartEventStatusStatistics } from "@/app/(subsystem)/counterpart/(statistics)/week-vouchers";

export default function DashboardPage() {
    return (
        <div className="overflow-hidden">
            <OverviewStatistics />
            <div className="pt-4">
                <h3 className="text-2xl text-gradient font-semibold">Voucher Statistics</h3>
                <div className="py-2">
                    <CounterpartEventStatusStatistics />
                    {/* <BasicLineChart /> */}
                </div>
            </div>
        </div>
    );
}
