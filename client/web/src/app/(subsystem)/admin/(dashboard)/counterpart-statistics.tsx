"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
const chartData = [
    { date: "2024-06-24", happening: 2, ended: 2 },
    { date: "2024-06-25", happening: 10, ended: 1 },
    { date: "2024-06-26", happening: 4, ended: 1 },
    { date: "2024-06-27", happening: 8, ended: 0 },
    { date: "2024-06-28", happening: 1, ended: 2 },
    { date: "2024-06-29", happening: 0, ended: 0 },
    { date: "2024-06-30", happening: 4, ended: 10 },
];
const chartTodayData = [
    { date: "2024-06-24", happening: 2, ended: 2 },
    { date: "2024-06-25", happening: 10, ended: 1 },
    { date: "2024-06-26", happening: 4, ended: 1 },
];

const chartConfig = {
    happening: {
        label: "Happening events",
        color: "hsl(var(--chart-1))",
    },
    ended: {
        label: "Ended events",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export function EventStatusStatistics() {
    const [eventData, setEventData] = useState(chartTodayData);
    return (
        <Card className="w-full mt-3 border-gray-50">
            <CardHeader className="py-3 px-5 flex flex-row justify-between flex-nowrap">
                <div>
                    <CardTitle className="text-md">Event statistics</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">
                        Showing how many events are happening and ended this week
                    </CardDescription>
                </div>
                <Select onValueChange={(value) => setEventData(value === "today" ? chartTodayData : chartData)}>
                    <SelectTrigger className="w-[120px] scale-90 border-gray-300">
                        <SelectValue placeholder="Last 3 days" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today" defaultChecked>
                            Last 3 days
                        </SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto h-[18rem] aspect-auto">
                    <AreaChart
                        accessibilityLayer
                        data={eventData}
                        margin={{
                            left: -20,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey="date"
                            tickLine={true}
                            axisLine={true}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "numeric",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis tickLine={true} axisLine={true} tickMargin={8} tickCount={3} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            dataKey="happening"
                            type="linear"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-1))"
                            stackId="a"
                            dot={{
                                fill: "hsl(var(--chart-1))",
                            }}
                        />
                        <Area
                            dataKey="ended"
                            type="linear"
                            fill="hsl(var(--chart-2))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-2))"
                            stackId="a"
                            dot={{
                                fill: "hsl(var(--chart-2))",
                            }}
                        />
                        <ChartLegend
                            content={<ChartLegendContent />}
                            className="p-0 translate-y-3 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            January - June 2024
                        </div>
                    </div>
                </div>
            </CardFooter> */}
        </Card>
    );
}
