"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

const playTurnTodayData = [
    { game: "quiz", plays: 4, fill: "hsl(var(--chart-1))" },
    { game: "shake", plays: 32, fill: "hsl(var(--chart-4))" },
];

const playTurnThisWeekData = [
    { game: "quiz", plays: 75, fill: "hsl(var(--chart-1))" },
    { game: "shake", plays: 100, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
    plays: {
        label: "Plays",
    },
    quiz: {
        label: "Realtime Quiz ",
        color: "hsl(var(--chart-1))",
    },
    shake: {
        label: "Shake and Win",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

export function PlayTurnStatistics() {
    const [playTurnData, setPlayTurnData] = useState(playTurnTodayData);
    const totalPlays = useMemo(() => {
        return playTurnData.reduce((acc, curr) => acc + curr.plays, 0);
    }, []);

    return (
        <Card className="flex flex-col border-gray-50">
            <CardHeader className="items-center p-0 flex flex-row justify-between">
                <CardTitle className="px-5 flex-[1]">Total play turn this week</CardTitle>
                <Select
                    onValueChange={(value) =>
                        setPlayTurnData(value === "today" ? playTurnTodayData : playTurnThisWeekData)
                    }
                >
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
            <CardContent className="flex-1 p-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[23rem]">
                    <PieChart>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="game" />}
                            className="p-0 -translate-y-3 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
                        <Pie
                            data={playTurnData}
                            dataKey="plays"
                            nameKey="game"
                            innerRadius={60}
                            strokeWidth={8}
                            labelLine={false}
                            label={({ payload, ...props }) => {
                                return (
                                    <text
                                        cx={props.cx}
                                        cy={props.cy}
                                        x={props.x}
                                        y={props.y}
                                        textAnchor={props.textAnchor}
                                        dominantBaseline={props.dominantBaseline}
                                        fill="hsla(var(--foreground))"
                                    >
                                        {payload.plays}
                                    </text>
                                );
                            }}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-5xl font-semibold"
                                                >
                                                    {totalPlays.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-[1rem]"
                                                >
                                                    Play turns
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
