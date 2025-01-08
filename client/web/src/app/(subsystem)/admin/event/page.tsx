"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import CustomShadcnPagination from "@/components/shared/custom-pagination";
import {
    Ban,
    ChevronDown,
    DivideSquareIcon,
    Eye,
    Info,
    LockKeyholeOpen,
    LucideSettings,
    Search,
    Timer,
    UserPlus2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import { toggleBlockUser } from "@/apis/user-api";
import { useCachedEventListQuery } from "@/lib/react-query/eventCache";
import { ROLE_ADMIN } from "@/components/shared/authenticatedRoutes";
import { defaultGameImage, printDateTime } from "@/lib/utils";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import ViewAndActionForEvent from "@/app/(subsystem)/admin/event/view-action-event";
import { getBadgeCSS } from "@/app/(subsystem)/admin/event/event-status-badge";
import { eventStatusList } from "@/app/(subsystem)/admin/event/event-status";

export default function EventManagement() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const currentPageNullable = searchParams.get("page");
    const currentPage = currentPageNullable ? parseInt(currentPageNullable) : 1;
    const perPage = searchParams.get("perPage") ? parseInt(searchParams.get("perPage") || "") : 5;
    const keyword = searchParams.get("keyword") || "";
    const status = searchParams.get("status") || "";
    const startTime = searchParams.get("startTime") || "";
    const endTime = searchParams.get("endTime") || "";
    const {
        data: currentEvents,
        isLoading,
        isError,
        isFetched,
        isPaused,
        refetch,
    } = useCachedEventListQuery(ROLE_ADMIN, currentPage, perPage, keyword, status, startTime, endTime);
    if (isError) return <p>Something went wrong</p>;
    if (isLoading || isPaused || !currentEvents) return <Loading />; // Isloading is true when api in queryFn was calling and data doesn't exist in cache
    if (isFetched) {
        if (currentEvents == null) return <div>Error to display movie info</div>;
    }
    if (currentEvents == null) return <div>There is an error to display movie</div>;
    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        const newUrl = `${pathname}?${params.toString()}`;
        console.log(newUrl);
        replace(newUrl);
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("keyword", e.target.value);
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }
    const handleFilterStatus = (eventStatus: string) => {
        const params = new URLSearchParams(searchParams);
        if (eventStatus) {
            params.set("status", eventStatus);
        } else {
            params.delete("status");
        }
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    const handleFilterStartTime = (startTime: string) => {
        if (startTime && endTime && startTime > endTime) return;
        const params = new URLSearchParams(searchParams);
        if (startTime) {
            params.set("startTime", startTime);
        } else {
            params.delete("startTime");
        }
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    const handleFilterEndTime = (endTime: string) => {
        if (startTime && endTime && startTime > endTime) return;
        const params = new URLSearchParams(searchParams);
        if (endTime) {
            params.set("endTime", endTime);
        } else {
            params.delete("endTime");
        }
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    const resetAllFilter = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("keyword");
        params.delete("status");
        params.delete("startTime");
        params.delete("endTime");
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    const handleResetTimeFilter = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("startTime");
        params.delete("endTime");
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    return (
        <div className="rounded-sm">
            <div className="flex items-end justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">Event Management</h1>
            </div>
            <div className="flex items-center justify-between my-2 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className=" border border-gray-200">
                            Sort by:
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="border-gray-200">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="border-gray-200">
                                        <DropdownMenuItem
                                            onClick={() => handleFilterStatus("")}
                                            className="!cursor-pointer"
                                        >
                                            All
                                        </DropdownMenuItem>
                                        {eventStatusList.map((eventSatus, index) => {
                                            return (
                                                <DropdownMenuItem
                                                    key={index}
                                                    onClick={() => handleFilterStatus(eventSatus)}
                                                    className="!cursor-pointer"
                                                >
                                                    {eventSatus}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Time</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="p-2 border-gray-200">
                                        <label className="block text-sm font-medium ">Start time</label>
                                        <Input
                                            type="datetime-local"
                                            value={startTime}
                                            onChange={(e) => {
                                                handleFilterStartTime(e.target.value);
                                            }}
                                            className="w-full border p-1 rounded-md bg-white dark:bg-black border-gray-300"
                                        />
                                        <label className="block text-sm font-medium mt-1">End time</label>
                                        <Input
                                            type="datetime-local"
                                            value={endTime}
                                            onChange={(e) => {
                                                handleFilterEndTime(e.target.value);
                                            }}
                                            className="w-full border p-1 rounded-md bg-white dark:bg-black border-gray-300"
                                        />
                                        <div className="flex justify-center">
                                            <Badge
                                                className="cancel-btn-color mt-2 cursor-pointer"
                                                onClick={handleResetTimeFilter}
                                            >
                                                Reset
                                            </Badge>
                                        </div>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>

                        {/* <DropdownMenuItem>Name</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
                {(keyword || status || startTime || endTime) && (
                    <Badge onClick={resetAllFilter} className="cursor-pointer px-2 py-1 cancel-btn-color text-white">
                        Reset
                    </Badge>
                )}
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pr-10 rounded-full  border border-gray-200 bg-white dark:bg-black"
                        defaultValue={keyword}
                        onChange={handleSearch}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 px-2">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white dark:bg-slate-900 border-gray-200">
                <Table className="overflow-x-auto rounded-md min-w-max">
                    <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-800">
                            <TableHead className="text-center">No.</TableHead>
                            <TableHead className="text-left">Image</TableHead>
                            <TableHead className="text-left">Name</TableHead>
                            <TableHead className="text-left">Start/End time </TableHead>
                            <TableHead className="text-center">Total voucher</TableHead>
                            <TableHead className="text-center">Collection items</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center"> Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center">
                        {currentEvents.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    No event found
                                </TableCell>
                            </TableRow>
                        )}
                        {currentEvents.data.map((event, index) => (
                            <TableRow key={event.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <img
                                        src={event.image || defaultGameImage}
                                        alt="Event image"
                                        className="w-24 h-16 object-cover rounded-md overflow-hidden"
                                    />
                                </TableCell>
                                <TableCell className="font-medium line-clamp-2 text-left">{event.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Timer size={15} />
                                        <span>{`${printDateTime(new Date(event.startTime))}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Timer size={15} />
                                        <span>{`${printDateTime(new Date(event.endTime))}`}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{event.totalVouchers}</TableCell>
                                <TableCell>
                                    {event.item ? (
                                        <span className={getBadge()}>{`${event.item.numberPieces} pieces`}</span>
                                    ) : (
                                        "None"
                                    )}
                                </TableCell>
                                <TableCell>{getBadgeCSS(event.status)}</TableCell>

                                <TableCell className="text-center">
                                    <ViewAndActionForEvent eventDetail={event} refetchData={refetch}>
                                        <Info
                                            size={25}
                                            strokeWidth={3}
                                            color="blue"
                                            onClick={() => {}}
                                            className="mx-auto"
                                        />
                                    </ViewAndActionForEvent>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
                Showing {1} to {5} users
            </div>
            <div className="flex items-center justify-center mt-3">
                <CustomShadcnPagination
                    currentPage={currentEvents.page}
                    totalPages={currentEvents.totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
