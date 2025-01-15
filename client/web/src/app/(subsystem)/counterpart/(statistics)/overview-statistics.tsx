"use client";
import {
    ArrowUpLeft,
    ChevronDown,
    Earth,
    LucideIcon,
    PartyPopper,
    TicketPercent,
    UserPlus2,
    UsersRound,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { useCachedCounterpartDataStatistic } from "@/lib/react-query/counterpartDashboardCache";
import { StatisticDataCardSkeleton } from "@/app/(subsystem)/admin/skeletons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const OverviewStatistics = () => {
    const { data, isLoading, isError, isPaused } = useCachedCounterpartDataStatistic();
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !data)
        return (
            <>
                <div className="flex justify-between items-center p-1 pl-0">
                    <h3 className="text-2xl text-gradient font-semibold">Overview Statistics</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatisticDataCardSkeleton items={{ icon: PartyPopper }} />
                    <StatisticDataCardSkeleton items={{ icon: UserPlus2 }} />
                    <StatisticDataCardSkeleton items={{ icon: TicketPercent }} />
                </div>
            </>
        );
    const [totalEvents, totalUsedVouchers, totalVouchers] = data.data;
    return (
        <>
            <div className="flex justify-between items-center p-1 pl-0">
                <h3 className="text-2xl text-gradient font-semibold">Overview Statistics</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <DataCard
                    title="Total Events"
                    data={totalEvents.data}
                    trending={totalEvents.data}
                    icon={{ icon: PartyPopper }}
                />
                <DataCard
                    title="Total Vouchers"
                    data={totalVouchers.data}
                    trending={totalVouchers.data}
                    icon={{ icon: TicketPercent }}
                />
                <DataCard
                    title="Total Redeemed Vouchers"
                    data={totalUsedVouchers.data}
                    trending={totalUsedVouchers.data}
                    icon={{ icon: TicketPercent }}
                />
            </div>
        </>
    );
};

function DataCard({
    title,
    data,
    trending,
    icon,
}: {
    title: string;
    data: any;
    trending: any;
    icon: { icon: React.ElementType };
}) {
    return (
        <Card title="Yearly Breakup" className="w-full h-full p-3 dark:bg-slate-800">
            <div className="flex justify-between items-center">
                <dl className="space-y-3">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</dt>
                    <dd className="text-2xl font-light md:text-4xl dark:text-white">{data}</dd>
                    <dd className="flex items-center space-x-1 text-sm font-medium text-lime-500 dark:text-lime-300">
                        <span>{trending}</span>
                        <ArrowUpLeft />
                    </dd>
                </dl>
                <dl>
                    <icon.icon size={72} stroke="#3b82f6" />
                </dl>
            </div>
        </Card>
    );
}

export default OverviewStatistics;
