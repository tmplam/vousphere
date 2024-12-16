"use client";

import { MySubscriptionSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import ErrorPage from "@/app/error";
import MapWithClick from "@/lib/leaflet/Map";
import ViewMap from "@/lib/leaflet/ViewMap";
import { useCachedSubscriptionQuery } from "@/lib/react-query/eventCache";

export default function MySubscription() {
    const { data: subscription, isLoading, isError, isPaused } = useCachedSubscriptionQuery();
    if (isError || subscription === null) return <ErrorPage />;
    if (isLoading || isPaused || !subscription) return <MySubscriptionSkeleton />; // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">My subscription</h1>
            </div>
            <div className="p-3">
                <div className="flex flex-wrap justify-between gap-3 min-h-[20rem] p-2 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white">
                    <div className="info xl:max-w-[23rem] flex-shrink-0">
                        <div className="py-1">
                            <b className="font-semibold">Name: </b>
                            {subscription.name}
                        </div>
                        <div className="py-1">
                            <b className="font-semibold">Area: </b>
                            {subscription.area}
                        </div>
                        <div className="py-1">
                            <b className="font-semibold">Address: </b>
                            {subscription.address}
                        </div>
                        <div className="py-1">
                            <b className="font-semibold">Status: </b>
                            {subscription.status ? "Active" : "Paused"}
                        </div>
                    </div>
                    <div className="map w-full mx-auto flex-[1] min-h-[15rem] flex-shrink-0 lg:basis-[30rem] md:min-h-[20rem]">
                        <ViewMap location={{ lat: subscription.location[0], lng: subscription.location[1] }} />
                    </div>
                </div>
            </div>
        </>
    );
}
