"use client";
import EventCard from "@/app/(subsystem)/counterpart/event/event-card";
import { MyEventsSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import ErrorPage from "@/app/error";
import { ROLE_COUNTERPART } from "@/components/shared/authenticatedRoutes";
import AnimationColorfulButton, { AnimationButton } from "@/components/shared/custom-button";
import CustomShadcnPagination from "@/components/shared/custom-pagination";
import { useCachedEventListQuery } from "@/lib/react-query/eventCache";
import { EventGameType } from "@/schema/event.schema";
import { PartyPopper, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Event() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPageNullable = searchParams.get("page");
    const currentPage = currentPageNullable ? parseInt(currentPageNullable) : 1;
    const {
        data: myEvents,
        isLoading,
        isError,
        isFetching,
        isPaused,
        refetch,
    } = useCachedEventListQuery(ROLE_COUNTERPART, currentPage, 6);
    if (isError) return <ErrorPage />;
    // if (isFetching) console.log("Fetching subscription");
    // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    if (isLoading || isPaused || isFetching) {
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">My Event</h1>
                    <AnimationButton className="p-2 px-3">
                        <Link href="/counterpart/event/new-event">New event</Link>
                        <PartyPopper />
                    </AnimationButton>
                </div>
                <div className="flex justify-start flex-wrap gap-4">
                    <MyEventsSkeleton />
                </div>
            </>
        );
    }
    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };
    if (!isLoading && !myEvents) return <ErrorPage />;
    if (!isLoading && myEvents?.data.length === 0) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">My Event</h1>
                    <AnimationButton className="p-2 px-3">
                        <Link href="/counterpart/event/new-event">New event</Link>
                        <PartyPopper />
                    </AnimationButton>
                </div>
                <p className="text-center px-6">You don&apos;t have any event yet</p>
            </div>
        );
    }
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">My Event</h1>
                <AnimationButton className="p-2 px-3">
                    <Link href="/counterpart/event/new-event">New event</Link>
                    <PartyPopper />
                </AnimationButton>
            </div>
            <div className="flex flex-wrap lg:gap-x-6 gap-y-4 justify-center xl:justify-start ">
                {myEvents?.data!.map((event, index) => (
                    <Link key={index} href={`/counterpart/event/detail/${event.id}`} className="">
                        <EventCard key={index} event={event} />
                    </Link>
                ))}
            </div>
            <div className="flex items-center justify-center pt-6 pb-10">
                <CustomShadcnPagination
                    currentPage={currentPage}
                    totalPages={myEvents!.totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
}
