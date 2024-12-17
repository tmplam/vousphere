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
