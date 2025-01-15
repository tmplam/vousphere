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
import { PlayTurnSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { useCachedBrandVoucherStatistic } from "@/lib/react-query/counterpartDashboardCache";

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

export function BrandGameVouchersStatistics() {
    const [time, setTime] = useState("today");
    const { data: playTurnData, isLoading, isError, isPaused } = useCachedBrandVoucherStatistic();
    if (isError) return <div>Error</div>;
    if (isLoading || isPaused || !playTurnData) return <PlayTurnSkeleton />;
    // console.log(playTurnData);
    const totalVouchers = playTurnData.reduce((total: any, item: any) => total + item.releasedVouchers, 0);
    return (
        <Card className="flex flex-col border-gray-50">
            <CardHeader className="items-center p-0 pt-1 flex flex-row justify-between">
                <div className=" px-5 flex-[1]">
                    <CardTitle className="text-md">Game vouchers</CardTitle>
                    <CardDescription className="text-xs">Total vouchers were released of each game</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[23rem]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
                        <Pie
                            data={playTurnData}
                            dataKey="releasedVouchers"
                            nameKey="gameName"
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
                                        {payload.gameName}
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
                                                    {totalVouchers}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-[1rem]"
                                                >
                                                    Vouchers
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
