"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useCachedNewUsersStatistic } from "@/lib/react-query/dashboardCache";
import { NewUserChartBarSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { useState } from "react";

const chartConfig = {
    counterpart: {
        label: "Counterpart",
        color: "hsl(var(--chart-1))",
    },
    player: {
        label: "Customer",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function NewUserStatistics() {
    const [time, setTime] = useState("thisweek");
    const { data: newUsersData, isLoading, isError, isPaused } = useCachedNewUsersStatistic(time);
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !newUsersData) return <NewUserChartBarSkeleton />;
    const sortedUserData = newUsersData.sort((a, b) => (a.date > b.date ? 1 : -1));
    return (
        <Card>
            <CardHeader className="pt-1 px-5 flex flex-row justify-between flex-nowrap">
                <div className="space-y-2 pt-2">
                    <CardTitle>Registered accounts</CardTitle>
                    <CardDescription>Showing how many users have registered in a week</CardDescription>
                </div>
                <Select onValueChange={(value) => setTime(value)}>
                    <SelectTrigger className="w-[120px] scale-90 border-gray-300">
                        <SelectValue placeholder="This week" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="thisweek" defaultChecked={time == "thisweek"}>
                            This week
                        </SelectItem>
                        <SelectItem value="lastweek" defaultChecked={time == "lastweek"}>
                            Last week
                        </SelectItem>
                        <SelectItem value="last2weeks" defaultChecked={time == "last2weeks"}>
                            Last 2 weeks
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={sortedUserData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <YAxis tickLine={true} axisLine={true} tickMargin={8} tickCount={3} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="counterpart" fill="hsl(var(--chart-1))" radius={4} />
                        <Bar dataKey="player" fill="hsl(var(--chart-4))" radius={4} />
                        <ChartLegend
                            content={<ChartLegendContent />}
                            className="p-0 translate-y-3 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
