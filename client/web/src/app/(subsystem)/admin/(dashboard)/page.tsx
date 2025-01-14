"use client";
import { EventStatusStatistics } from "@/app/(subsystem)/admin/(dashboard)/counterpart-statistics";
import { GameVouchersStatistics } from "@/app/(subsystem)/admin/(dashboard)/game-statistics";
import OverviewStatistics from "@/app/(subsystem)/admin/(dashboard)/overview-statistics";
import { NewUserStatistics } from "@/app/(subsystem)/admin/(dashboard)/user-statistics";

export default function DashboardPage() {
    return (
        <div className="overflow-hidden">
            <OverviewStatistics />

            <div className="pt-4">
                <h3 className="text-2xl text-gradient font-semibold">User Statistics</h3>
                <div className="py-2">
                    <NewUserStatistics />
                    {/* <BasicLineChart /> */}
                </div>
            </div>

            <div className="pt-4">
                <h3 className="text-2xl text-gradient font-semibold">Game and Event Statistics</h3>
                <div className="flex">
                    <EventStatusStatistics />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <GameVouchersStatistics />
                    {/* <BasicLineChart /> */}
                </div>
            </div>
        </div>
    );
}
