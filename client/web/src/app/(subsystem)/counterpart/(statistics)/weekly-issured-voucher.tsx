"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { useCachedWeeklyVoucherIssureStatistic } from "@/lib/react-query/dashboardCache";
import { EventStatusSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useCachedCounterpartWeeklyVoucherIssureStatistic } from "@/lib/react-query/counterpartDashboardCache";

const chartConfig = {
    issuedVouchers: {
        label: "Issued Vouchers",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CounterpartWeeklyIssuedVouchers() {
    const [time, setTime] = useState(new Date().toJSON());
    const { data: eventData, isLoading, isError, isPaused } = useCachedCounterpartWeeklyVoucherIssureStatistic(time);
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !eventData) return <EventStatusSkeleton />;
    console.log(eventData);
    const chartData = eventData.map((item: any) => ({
        date: formatDate(new Date(item.date)),
        issuedVouchers: item.issuedVouchers,
    }));
    return (
        <Card className="w-full">
            <CardHeader className="pt-1 px-5 flex flex-row justify-between flex-nowrap">
                <div className="space-y-2 pt-2">
                    <CardTitle>Weekly issured vouchers</CardTitle>
                    <CardDescription>Showing how many vouchers have been issued weekly</CardDescription>
                </div>
                <div className="w-36">
                    <Input type="date" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="issuedVouchers" fill="hsl(var(--chart-1))" radius={8}>
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
