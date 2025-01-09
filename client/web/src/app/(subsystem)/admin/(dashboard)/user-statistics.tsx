"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useCachedNewUsersStatistic } from "@/lib/react-query/dashboardCache";
import { NewUserChartBarSkeleton } from "@/app/(subsystem)/admin/skeletons";

const chartConfig = {
    views: {
        label: "Participants",
    },
    counterpart: {
        label: "Counterpart",
        color: "hsl(var(--chart-1))",
    },
    customer: {
        label: "Customer",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function NewUserStatistics() {
    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("counterpart");
    const { data: newUsersData, isLoading, isError, isPaused } = useCachedNewUsersStatistic("week");
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !newUsersData) return <NewUserChartBarSkeleton />;
    const total = {
        counterpart: newUsersData.reduce((acc, curr) => acc + curr.counterpart, 0),
        customer: newUsersData.reduce((acc, curr) => acc + curr.customer, 0),
    };
    return (
        <Card className="border-gray-50">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-b-gray-200 p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center px-6 py-0">
                    <CardTitle className="text-md p-0">Registered accounts</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                        Showing how many users have registered an account this week
                    </CardDescription>
                </div>
                <div className="flex">
                    {["counterpart", "customer"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 py-2"
                                onClick={() => setActiveChart(chart)}
                            >
                                <p className="text-xs text-gradient-blue font-semibold">{chartConfig[chart].label}</p>
                                <p className="text-md font-bold leading-none sm:text-xl text-center">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6 !pl-0">
                <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
                    <BarChart
                        accessibilityLayer
                        data={newUsersData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis tickLine={true} axisLine={true} tickMargin={8} tickCount={3} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
