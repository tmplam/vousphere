"use client";
import { ArrowUpLeft, Earth, LucideIcon, PartyPopper, TicketPercent, UserPlus2, UsersRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getCachedAdminDataStatistic } from "@/lib/react-query/dashboardCache";
import { StatisticDataCardSkeleton } from "@/app/(subsystem)/admin/(dashboard)/skeletons";

type DataStatisticType = {};

const YearlyBreakup = () => {
    const { data, isLoading, isError, isPaused } = getCachedAdminDataStatistic();
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !data)
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatisticDataCardSkeleton items={{ icon: PartyPopper }} />
                <StatisticDataCardSkeleton items={{ icon: UserPlus2 }} />
                <StatisticDataCardSkeleton items={{ icon: TicketPercent }} />
                <StatisticDataCardSkeleton items={{ icon: Earth }} />
            </div>
        );
    const [revenue, orders, users] = data.data;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <DataCard
                title="Total Event"
                data={revenue.data}
                trending={revenue.trending}
                icon={{ icon: PartyPopper }}
            />
            <DataCard title="Total User" data={orders.data} trending={orders.trending} icon={{ icon: UserPlus2 }} />
            <DataCard
                title="Total Voucher"
                data={users.data}
                trending={users.trending}
                icon={{ icon: TicketPercent }}
            />
            <DataCard title="Total Campaign" data={users.data} trending={users.trending} icon={{ icon: Earth }} />
        </div>
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
        <Card title="Yearly Breakup" className="w-full h-full p-3">
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

export default YearlyBreakup;
