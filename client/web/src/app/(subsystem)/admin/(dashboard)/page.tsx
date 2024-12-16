"use client";
import { EventStatusStatistics } from "@/app/(subsystem)/admin/(dashboard)/counterpart-statistics";
import { PlayTurnStatistics } from "@/app/(subsystem)/admin/(dashboard)/game-statistics";
import BasicLineChart from "@/app/(subsystem)/admin/(dashboard)/line-chart";
import OverviewStatistics from "@/app/(subsystem)/admin/(dashboard)/overview-statistics";
import { NewUserStatistics } from "@/app/(subsystem)/admin/(dashboard)/user-statistics";

export default function DashboardPage() {
    return (
        <div className="overflow-hidden">
            <OverviewStatistics />

            <div className="pt-4">
                <h3 className="text-2xl font-semibold">User Statistics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <NewUserStatistics />
                    <BasicLineChart />
                </div>
                <div className="flex">
                    <EventStatusStatistics />
                </div>
            </div>

            <div className="pt-4">
                <h3 className="text-2xl font-semibold">Game Statistics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <PlayTurnStatistics />
                    <BasicLineChart />
                </div>
            </div>
        </div>
    );
}
