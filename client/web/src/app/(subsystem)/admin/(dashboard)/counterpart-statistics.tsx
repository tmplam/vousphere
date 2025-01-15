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
import { useCachedEventStatusStatistic } from "@/lib/react-query/dashboardCache";
import { EventStatusSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

const chartConfig = {
    numberOfPendings: {
        label: "Incoming events",
        color: "hsl(var(--chart-2))",
    },
    numberOfHappenings: {
        label: "Happening events",
        color: "hsl(var(--chart-1))",
    },
    numberOfEndeds: {
        label: "Ended events",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export function EventStatusStatistics() {
    const [time, setTime] = useState(new Date().toJSON());
    const { data: eventData, isLoading, isError, isPaused } = useCachedEventStatusStatistic(time);
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !eventData) return <EventStatusSkeleton />;
    return (
        <Card className="w-full mb-3 border-gray-50">
            <CardHeader className="pt-1 px-5 flex flex-row justify-between flex-nowrap">
                <div>
                    <CardTitle className="text-md">Event participants</CardTitle>
                    <CardDescription className="text-xs line-clamp-1">
                        Showing how many events are incoming, happening and ended in a week
                    </CardDescription>
                </div>
                <div className="w-36">
                    <Input type="date" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
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
                                return date.toLocaleDateString("vi", {
                                    month: "numeric",
                                    year: "numeric",
                                    day: "numeric",
                                });
                            }}
                        />
                        <YAxis tickLine={true} axisLine={true} tickMargin={8} tickCount={3} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            dataKey="numberOfPendings"
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
                            dataKey="numberOfHappenings"
                            type="linear"
                            fill="hsl(var(--chart-3))"
                            fillOpacity={0.4}
                            stroke="hsl(var(--chart-3))"
                            stackId="a"
                            dot={{
                                fill: "hsl(var(--chart-3))",
                            }}
                        />
                        <Area
                            dataKey="numberOfEndeds"
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
        </Card>
    );
}
