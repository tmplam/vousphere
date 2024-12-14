"use client";
import { MobileDesktop } from "@/app/(subsystem)/admin/(dashboard)/bar-charts";
import BasicLineChart from "@/app/(subsystem)/admin/(dashboard)/line-chart";
import YearlyBreakup from "@/app/(subsystem)/admin/(dashboard)/statistics";

export default function DashboardPage() {
    return (
        <div className="overflow-hidden">
            <YearlyBreakup />
            <BasicLineChart />
        </div>
    );
}
