import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type LucideIcon } from "lucide-react";

// Loading animation
const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}>
            <div className="flex p-4">
                <div className="h-5 w-5 rounded-md bg-gray-200" />
                <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
            </div>
            <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
                <div className="h-7 w-20 rounded-md bg-gray-200" />
            </div>
        </div>
    );
}

export function StatisticDataCardSkeleton({ items }: { items: { icon: LucideIcon } }) {
    return (
        <div className={`${shimmer} relative overflow-hidden rounded-xl custom-bg-white border`}>
            <div className="flex justify-between items-center w-full h-full p-3 ">
                <dl className="space-y-3">
                    <Skeleton className="h-5 w-20 rounded-md bg-gray-100" />
                    <Skeleton className="h-8 w-32 rounded-md bg-gray-200" />
                    <Skeleton className="h-5 w-16 rounded-md bg-gray-100" />
                </dl>
                <dl>
                    <items.icon size={72} stroke="#3b82f6" />
                </dl>
            </div>
        </div>
    );
}

export function NewUserChartBarSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-xl custom-bg-white border w-full bg-white dark:bg-gray-950 mb-3 border-gray-50`}
        >
            <div className="flex flex-col w-full h-[20rem] p-3 gap-2">
                <div className="flex justify-between items-center w-full">
                    <div className="flex-[1]">
                        <Skeleton className="py-3 h-6 w-20 mb-1 rounded-md bg-gray-200" />
                        <Skeleton className="py-3 h-6 w-64 rounded-md bg-gray-200" />
                    </div>
                    <div className="flex basis-[4rem] gap-2">
                        <Skeleton className="h-12 w-16 bg-gray-200" />
                        <Skeleton className="h-12 w-16 bg-gray-200" />
                    </div>
                </div>
                <Skeleton className="h-52 w-full mt-2 rounded-md bg-gray-200" />
            </div>
        </div>
    );
}

export function EventStatusSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-xl custom-bg-white border w-full bg-white dark:bg-gray-950 mb-3 border-gray-50`}
        >
            <div className="flex flex-col w-full h-[20rem] p-3 gap-2">
                <Skeleton className="py-3 h-6 w-20 rounded-md bg-gray-200" />
                <Skeleton className="py-3 h-6 w-56 rounded-md bg-gray-200" />
                <Skeleton className="h-52 w-full rounded-md bg-gray-200" />
                <div className="flex justify-center items-center gap-2 md:gap-6 lg:gap-8">
                    <Skeleton className="h-5 w-28 rounded-md bg-gray-200" />
                    <Skeleton className="h-5 w-28 rounded-md bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

export function PlayTurnSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-xl custom-bg-white border w-full bg-white dark:bg-gray-950 mb-3 border-gray-50`}
        >
            <div className="flex flex-col w-full h-[22rem] p-3 gap-2">
                <div className="flex justify-between items-center w-full">
                    <div className="flex-[1]">
                        <Skeleton className="py-3 h-6 w-20 mb-1 rounded-md bg-gray-200" />
                        <Skeleton className="py-3 h-6 w-64 rounded-md bg-gray-200" />
                    </div>
                    <div className="flex basis-[4rem] gap-2">
                        <Skeleton className="h-7 w-24 bg-gray-200" />
                    </div>
                </div>
                <Skeleton className="h-64 w-60 mt-1 mx-auto rounded-full bg-gray-200" />
                <div className="flex justify-center items-center gap-4 md:gap-7 lg:gap-8">
                    <Skeleton className="h-5 w-28 rounded-md bg-gray-200" />
                    <Skeleton className="h-5 w-28 rounded-md bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

// export function RevenueChartSkeleton() {
//     return (
//         <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
//             <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
//             <div className="rounded-xl bg-gray-100 p-4">
//                 <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
//                 <div className="flex items-center pb-2 pt-6">
//                     <div className="h-5 w-5 rounded-full bg-gray-200" />
//                     <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
//                 </div>
//             </div>
//         </div>
//     );
// }

export function GameListSkeleton({ total = 3 }: { total?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-5 dark:text-white">
            {[...Array(total)].map((_, index) => (
                <Card className="w-full max-w-md border shadow-sm shadow-slate-50 rounded-lg" key={index}>
                    <CardHeader className="relative !p-0">
                        <Skeleton className="h-48 w-full object-cover rounded-t" />
                    </CardHeader>
                    <CardContent className="space-y-1 p-4">
                        <Skeleton className="h-5 w-1/2 rounded-md bg-gray-200" />
                        <Skeleton className="h-5 w-3/4 rounded-md bg-gray-200" />
                        <Skeleton className="h-5 w-1/3 rounded-md bg-gray-200" />
                        <Skeleton className="h-14 rounded-md bg-gray-200" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function GameInfoSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden rounded-xl p-2 shadow-sm`}>
            <h1 className="text-2xl md:text-4xl font-bold text-gradient">Game Info</h1>
            <div className="py-5">
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-wrap gap-4 p-4 border shadow-slate-50 shadow-[0_3px_7px_rgb(0,0,0,0.2)] rounded-lg">
                            {/* Hình ảnh game */}
                            <div className="flex flex-[1] basis-[200px] flex-shrink-0 w-full">
                                <Skeleton className="h-64 w-full object-cover rounded-md" />
                            </div>
                            {/* Thống tin game */}
                            <div className="px-4 flex-[2] space-y-3 basis-[300px] flex-shrink-0">
                                <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                                <Skeleton className="h-5 w-52 rounded-md bg-gray-200" />
                                <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                                <Skeleton className="h-5 w-80 rounded-md bg-gray-200" />
                                <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                                <Skeleton className="h-24 w-full rounded-md bg-gray-200" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
