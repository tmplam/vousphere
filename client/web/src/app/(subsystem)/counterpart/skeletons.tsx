import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type LucideIcon } from "lucide-react";

// Loading animation
const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function MySubscriptionSkeleton() {
    return (
        <>
            <div className="flex flex-wrap w-full min-h-[20rem] p-0 gap-4">
                <div className="flex-shrink-0 basis-[20rem] space-y-3">
                    <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                    <Skeleton className="h-6 w-52 rounded-md bg-gray-200 text-sm font-medium" />
                    <Skeleton className="h-5 w-24 rounded-md bg-gray-200" />
                    <Skeleton className="h-6 rounded-md bg-gray-200 text-sm font-medium" />
                    <Skeleton className="h-5 w-16 rounded-md bg-gray-200" />
                    <Skeleton className="h-6 w-32 rounded-md bg-gray-200 text-sm font-medium" />
                </div>
                <div className="flex-[1] flex items-center justify-center truncate rounded-xl bg-white flex-shrink-0 basis-[20rem]">
                    <Skeleton className="h-full w-full min-h-72 rounded-md bg-gray-200" />
                </div>
            </div>
            <div className="flex justify-center items-center mt-4">
                <Skeleton className="h-9 w-32 rounded-md bg-gray-200 text-sm font-medium" />
            </div>
        </>
    );
}

export function SelectGameSkeleton() {
    return (
        <>
            <Skeleton className="h-9 w-36 rounded-full bg-gray-200 text-sm font-medium" />
        </>
    );
}

export function MyEventsSkeleton({ amount = 4 }: { amount?: number }) {
    return (
        <>
            <div className="min-w-[310px] max-w-80 dark:bg-slate-800 rounded-xl border border-gray-100 overflow-hidden mx-auto md:mx-0">
                <Skeleton className="w-full h-48 object-cover" />
                <div className="p-4 pt-2 bg-slate-200 dark:bg-slate-800 space-y-1">
                    <Skeleton className="text-xl font-semibold mb-2 line-clamp-2 min-h-14" />
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <Skeleton className="h-6"></Skeleton>
                </div>
            </div>
            <div className="min-w-[310px] max-w-80 dark:bg-slate-800 rounded-xl border border-gray-100 overflow-hidden mx-auto md:mx-0">
                <Skeleton className="w-full h-48 object-cover" />
                <div className="p-4 pt-2 bg-slate-200 dark:bg-slate-800 space-y-1">
                    <Skeleton className="text-xl font-semibold mb-2 line-clamp-2 min-h-14" />
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <Skeleton className="h-6"></Skeleton>
                </div>
            </div>
            <div className="min-w-[310px] max-w-80 dark:bg-slate-800 rounded-xl border border-gray-100 overflow-hidden mx-auto md:mx-0">
                <Skeleton className="w-full h-48 object-cover" />
                <div className="p-4 pt-2 bg-slate-200 dark:bg-slate-800 space-y-1">
                    <Skeleton className="text-xl font-semibold mb-2 line-clamp-2 min-h-14" />
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="w-28 h-6"></Skeleton>
                        <div className="w-36 h-12"></div>
                    </div>
                    <Skeleton className="h-6"></Skeleton>
                </div>
            </div>
        </>
    );
}

export function MyEventDetailsSkeleton() {
    return (
        <>
            <div className="p-3 w-[90vw] sm:w-[80vw] lg:w-[60vw] shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white mx-auto">
                <div className="mx-auto space-y-4">
                    <div className="flex justify-center items-center w-[85%] md:w-[80%] h-72 lg:h-80 overflow-hidden rounded-lg mx-auto">
                        <Skeleton className="w-full h-full rounded-md bg-gray-200" />
                    </div>
                    <div className=" px-4 sm:px-6">
                        <div className="flex flex-col w-full space-y-2 lg:space-y-3 ">
                            <div className="flex items-center gap-1 text-xl sm:text-2xl">
                                <Skeleton className="h-5 w-40 rounded-md bg-gray-200" />
                            </div>
                            <Skeleton className="h-5 w-[70%] rounded-md bg-gray-200" />
                            <div className="flex items-center gap-1">
                                <div className="flex flex-[1] flex-wrap">
                                    <div className="w-32">
                                        <div className="flex items-center">
                                            <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col pl-6 lg:pl-3 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Skeleton className="h-12 w-32 rounded-md bg-gray-200" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-[1] flex-wrap">
                                    <div className="w-32">
                                        <div className="flex items-center">
                                            <Skeleton className="h-5 w-20 rounded-md bg-gray-200" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col pl-6 lg:pl-3 mt-1">
                                        <div className="flex items-center gap-1">
                                            <Skeleton className="h-12 w-32 rounded-md bg-gray-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1">
                                    <Skeleton className="h-6 w-28 rounded-md bg-gray-200" />
                                    <Skeleton className="h-6 w-48 rounded-md bg-gray-200 text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-4 mt-4">
                    <Skeleton className="h-9 w-28 rounded-md bg-gray-200 text-sm font-medium" />
                    <Skeleton className="h-9 w-28 rounded-md bg-gray-200 text-sm font-medium" />
                </div>
            </div>
        </>
    );
}
