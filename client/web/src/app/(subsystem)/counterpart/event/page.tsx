"use client";
import EventCard from "@/app/(subsystem)/counterpart/event/event-card";
import { MyEventsSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import ErrorPage from "@/app/error";
import { ROLE_COUNTERPART } from "@/components/shared/authenticatedRoutes";
import AnimationColorfulButton, { AnimationButton } from "@/components/shared/custom-button";
import { useCachedEventListQuery } from "@/lib/react-query/eventCache";
import { EventGameType } from "@/schema/event.schema";
import { PartyPopper, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Event() {
    const [create, setCreate] = useState<boolean>(false);
    const {
        data: myEvents,
        isLoading,
        isError,
        isFetching,
        isPaused,
        refetch,
    } = useCachedEventListQuery(ROLE_COUNTERPART);
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
            <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                {myEvents?.data!.map((event, index) => (
                    <Link key={index} href={`/counterpart/event/detail/${event.id}`} className="flex-grow-0">
                        <EventCard key={index} event={event} />
                    </Link>
                ))}
            </div>
        </>
    );
}
