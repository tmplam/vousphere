"use client";

import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import { MySubscriptionSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import { UpdateSubscriptionForm } from "@/app/(subsystem)/counterpart/subscription/subscribe/update-subscribe-form";
import ErrorPage from "@/app/error";
import { AnimationButton } from "@/components/shared/custom-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapWithClick from "@/lib/leaflet/Map";
import ViewMap from "@/lib/leaflet/ViewMap";
import { useCachedSubscriptionQuery } from "@/lib/react-query/eventCache";
import { CloudHail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MySubscription() {
    const [update, setUpdate] = useState<boolean>(false);
    const { data: subscription, isLoading, isError, isFetching, isPaused, refetch } = useCachedSubscriptionQuery();
    if (isError) return <ErrorPage />;
    // if (isFetching) console.log("Fetching subscription");
    // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    if (isLoading || isPaused || isFetching) {
        console.log("Loading subscription");
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">My subscription</h1>
                </div>
                <div className="p-3 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white">
                    <div className="flex items-center justify-center gap-3 min-h-[20rem] flex-col">
                        <MySubscriptionSkeleton />
                    </div>
                </div>
            </>
        );
    }
    if (!isLoading && !subscription)
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">My subscription</h1>
                </div>
                <div className="p-3 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white">
                    <div className="flex items-center justify-center gap-3 min-h-[20rem] flex-col">
                        <p className="text-center px-6">
                            You don&apos;t have any subscription yet. Click the button below to create a new one!
                        </p>
                        <Button className="bg-lime-500 hover:bg-lime-600">
                            <Link href="/counterpart/subscription/subscribe" className="text-white">
                                Create new subscription
                            </Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">My subscription</h1>
            </div>
            {!update ? (
                <>
                    <div className="p-3 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white">
                        <div className="flex flex-wrap justify-between gap-3 min-h-[20rem]">
                            <div className="info xl:max-w-[23rem]">
                                <p className="py-1">
                                    <b className="font-semibold">Name: </b>
                                    <span>{subscription?.name}</span>
                                </p>
                                <div className="py-1 flex items-center gap-3">
                                    <b className="font-semibold">Area: </b>
                                    <span className={getBadge()}>{subscription?.area?.name}</span>
                                </div>
                                <div className="py-1">
                                    <b className="font-semibold">Address: </b>
                                    {subscription?.address}
                                </div>
                                <div className="py-1 flex items-center gap-3">
                                    <b className="font-semibold">Status: </b>
                                    {subscription?.status ? (
                                        <Badge variant="default" className="bg-lime-500 text-white">
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="default" className="bg-rose-500 text-white">
                                            Expired
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="map w-full mx-auto flex-[1] min-h-[15rem] flex-shrink-0 lg:basis-[30rem] md:min-h-[20rem]">
                                <ViewMap
                                    location={{
                                        lat: subscription?.location[0] || 20,
                                        lng: subscription?.location[1] || 106,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full mt-3 lg:mt-6">
                            <AnimationButton
                                onClick={() => {
                                    setUpdate(!update);
                                }}
                                className="mx-auto py-[.37rem] px-3"
                            >
                                Update subscription
                            </AnimationButton>
                        </div>
                    </div>
                </>
            ) : (
                <UpdateSubscriptionForm
                    subscription={subscription}
                    back={(refetchData = false) => {
                        setUpdate(!update);
                        if (refetchData) {
                            refetch();
                        }
                    }}
                />
            )}

            <div className="flex justify-between items-center w-full mt-6">
                <AnimationButton className="py-[.37rem] px-3">
                    <Link href="/counterpart/subscription/subscribe" className="text-white">
                        Create new subscription
                    </Link>
                </AnimationButton>
            </div>
        </>
    );
}
