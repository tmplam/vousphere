"use client";
/* Khiem workspace - Render a simple list of all notifications here. View detail each notification by using dialog/modal. */
import { useState, useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { BellRing } from "lucide-react";
import { printDateTime } from "@/lib/utils";
import { useCachedNotificationListQuery } from "@/lib/react-query/notificationCache";
import { ROLE_ADMIN, ROLE_COUNTERPART } from "@/components/shared/authenticatedRoutes";
import Loading from "@/app/loading";
import CustomShadcnPagination from "@/components/shared/custom-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CounterpartNotificationPage() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPageNullable = searchParams.get("page");
    const currentPage = currentPageNullable ? parseInt(currentPageNullable) : 1;
    const {
        data: notificationPagination,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useCachedNotificationListQuery(ROLE_COUNTERPART, currentPage, 5);
    if (isError) return <p>Something went wrong</p>;
    if (isLoading || isFetching) return <Loading />; // Isloading is true when api in queryFn was calling and data doesn't exist in cache
    if (notificationPagination == null && !isLoading && !isFetching)
        return <div>There is an error to display notification</div>;
    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };
    return (
        <div className="pb-4">
            <div className="flex items-end justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">Notification</h1>
            </div>
            <div className="rounded-lg shadow">
                <div className="rounded-lg border border-gray-300 overflow-hidden p-2 space-y-2">
                    {notificationPagination!.data.length == 0 && <p>No notification</p>}
                    {notificationPagination!.data.length > 0 &&
                        notificationPagination!.data.map((notification, index) => (
                            <Link
                                key={index}
                                href={`/counterpart/event`}
                                className={`flex gap-4 p-3 border border-gray-200 rounded-lg transition-colors
                                ${!notification.isSeen ? "bg-slate-200 dark:bg-slate-800" : "bg-white dark:bg-black"}`}
                            >
                                <div className="flex items-center justify-center w-8 md:w-12  dark:bg-slate-800 rounded-sm">
                                    <BellRing className="w-12 h-8 md:h-10 rounded-md object-cover m-auto" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-sm font-semibold">{notification.title}</h2>
                                            <p className="mt-1 text-sm ">{notification.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                            {printDateTime(new Date(notification.createdAt))}
                                        </span>
                                    </div>
                                </div>
                                {!notification.isSeen && (
                                    <div className="flex-shrink-0 self-center">
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </Link>
                        ))}
                </div>
                <div className="flex items-center justify-center mt-3">
                    <CustomShadcnPagination
                        currentPage={currentPage}
                        totalPages={notificationPagination!.totalPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
