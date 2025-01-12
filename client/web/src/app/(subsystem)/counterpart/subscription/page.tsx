"use client";

import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import { MySubscriptionSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import { UpdateSubscriptionForm } from "@/app/(subsystem)/counterpart/subscription/subscribe/update-subscribe-form";
import { AnimationButton } from "@/components/shared/custom-button";
import ViewMap from "@/lib/leaflet/ViewMap";
import { useCachedUserInfo } from "@/lib/react-query/userCache";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MySubscription() {
    const [update, setUpdate] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const { data: userAuth, isLoading, isFetching, refetch } = useCachedUserInfo();
    useEffect(() => {
        const rf = searchParams.get("rf");
        if (rf) {
            refetch();
        }
    }, []);
    if (isLoading || isFetching) return <MySubscriptionSkeleton />;
    if (!userAuth?.brand || userAuth!.brand.address == "" || userAuth!.brand.domain == "")
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">My subscription</h1>
                </div>
                <div className="p-3 shadow-md border border-gray-100 rounded-md dark:bg-slate-800 bg-white">
                    <div className="flex items-center justify-center gap-3 min-h-[20rem] flex-col">
                        <p className="text-center px-6">
                            You don&apos;t have any subscription yet. Click the button below to create a new one!
                        </p>
                        <AnimationButton className="py-[.37rem] px-3">
                            <Link href="/counterpart/subscription/subscribe" className="text-white">
                                Create new subscription
                            </Link>
                        </AnimationButton>
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
                    <div className="p-3 shadow-md border border-gray-100 rounded-md dark:bg-slate-800 bg-white">
                        <div className="flex flex-wrap justify-between gap-3 min-h-[20rem]">
                            <div className="info xl:max-w-[23rem]">
                                <p className="py-1">
                                    <b className="font-semibold">Name: </b>
                                    <span>{userAuth!.name}</span>
                                </p>
                                <div className="py-1 flex items-center gap-3">
                                    <b className="font-semibold">Domain: </b>
                                    <span className={getBadge()}>{userAuth!.brand!.domain}</span>
                                </div>
                                <div className="py-1 flex items-center gap-3">
                                    <b className="font-semibold">Phone number: </b>
                                    <span className={getBadge()}>{userAuth!.phoneNumber}</span>
                                </div>
                                <div className="py-1">
                                    <b className="font-semibold">Address: </b>
                                    {userAuth!.brand!.address}
                                </div>
                            </div>
                            <div className="map w-full mx-auto flex-[1] min-h-[15rem] flex-shrink-0 lg:basis-[30rem] md:min-h-[20rem]">
                                <ViewMap
                                    location={{
                                        lat: userAuth!.brand!.latitude,
                                        lng: userAuth!.brand!.longitude,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center w-full mt-5 lg:mt-6">
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
                    subscription={userAuth!}
                    back={() => setUpdate(!update)}
                    refetchData={refetch}
                />
            )}
        </>
    );
}
