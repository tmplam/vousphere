"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
    { date: "2024-06-24", counterpart: 132, customer: 180 },
    { date: "2024-06-25", counterpart: 141, customer: 190 },
    { date: "2024-06-26", counterpart: 434, customer: 380 },
    { date: "2024-06-27", counterpart: 448, customer: 490 },
    { date: "2024-06-28", counterpart: 149, customer: 200 },
    { date: "2024-06-29", counterpart: 103, customer: 160 },
    { date: "2024-06-30", counterpart: 446, customer: 400 },
];

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

    const total = React.useMemo(
        () => ({
            counterpart: chartData.reduce((acc, curr) => acc + curr.counterpart, 0),
            customer: chartData.reduce((acc, curr) => acc + curr.customer, 0),
        }),
        []
    );

    return (
        <Card className="border-gray-50">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-b-gray-200 p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-0">
                    <CardTitle className="text-md p-0">Participants Statistics</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                        Showing how many total users have participated in this week
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
                                <p className="text-xs text-muted-foreground">{chartConfig[chart].label}</p>
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
                        data={chartData}
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
