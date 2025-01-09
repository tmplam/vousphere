"use client";

import { getBadgeCSS } from "@/app/(subsystem)/admin/event/event-status-badge";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import UpdateEventForm from "@/app/(subsystem)/counterpart/event/detail/[id]/update-event-form";
import GameItem, { RenderGameItemList } from "@/app/(subsystem)/counterpart/event/detail/[id]/view-game-item";
import ViewGameModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-game-modal";
import VoucherItem from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-item";
import ViewVoucherModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-modal";
import ImageGrid from "@/app/(subsystem)/counterpart/event/new-event/image-grid";

import { MyEventDetailsSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import ErrorPage from "@/app/error";
import { AnimationButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCachedMyEventDetailQuery } from "@/lib/react-query/eventCache";
import { defaultEventImage, defaultGameImage, getQueryParams, printTimeNoSecond } from "@/lib/utils";
import { Calendar, Clock, Gamepad, Gamepad2, Info, LayoutGrid, Star, Ticket, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EventDetails() {
    const [update, setUpdate] = useState<boolean>(false);
    const eventId = getQueryParams<string>(useParams(), "id");
    const {
        data: myEventDetail,
        isLoading,
        isError,
        isFetching,
        isPaused,
        refetch,
    } = useCachedMyEventDetailQuery(eventId);
    if (isError) return <ErrorPage />;
    // if (isFetching) console.log("Fetching subscription");
    // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    if (isLoading || isPaused || isFetching) {
        return (
            <>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold text-gradient">Event detail</h1>
                </div>
                <div className="p-3 w-[90vw] sm:w-[80vw] lg:w-[60vw] mx-auto">
                    <MyEventDetailsSkeleton />
                </div>
            </>
        );
    }
    if (!isLoading && !myEventDetail) return <ErrorPage />;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">{!update ? "Event detail" : "Update event detail"}</h1>
            </div>
            {!update ? (
                <>
                    <div className="p-3 w-[90vw] sm:w-[80vw] lg:w-[60vw] mx-auto">
                        <div className="space-y-4 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white mx-auto py-3">
                            <div className="flex justify-center items-center w-[85%] md:w-[80%] h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg mx-auto border">
                                <img
                                    src={myEventDetail!.image}
                                    alt={myEventDetail!.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full border object-cover shadow-md rounded-lg"
                                />
                            </div>
                            <div className="px-4 sm:px-8 xl:px-12 border-t border-t-gray-200 pt-2">
                                <div className="flex flex-col w-full space-y-2">
                                    <div className="text-xl sm:text-2xl font-thin">
                                        <b className="font-semibold">Event name:</b> {myEventDetail!.name}
                                    </div>
                                    <div className="text-lg">
                                        <b>Description: </b>
                                        <span className="text-md">{myEventDetail!.description}</span>
                                    </div>
                                    <div className="text-lg">
                                        <b>Status: </b>
                                        <span className="text-md -translate-y-[.2rem] inline-block ml-1">
                                            {getBadgeCSS(myEventDetail!.status)}
                                        </span>
                                    </div>
                                    {myEventDetail?.status === "Rejected" && (
                                        <div className="text-lg">
                                            <b>Reason rejected: </b>
                                            <span className="text-md text-red-600 dark:text-rose-500">
                                                {myEventDetail!.comment}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <div className="flex flex-[1] flex-wrap">
                                            <div className="w-32">
                                                <div className="flex items-center gap-1">
                                                    <Star className="inline w-6" size={18} />
                                                    <b className="text-lg">Start time:</b>
                                                </div>
                                            </div>
                                            <div className="flex flex-col pl-6 lg:pl-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="inline w-6" size={18} />
                                                    {new Date(myEventDetail!.startTime).toDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="inline w-6" size={18} />
                                                    {printTimeNoSecond(new Date(myEventDetail!.startTime))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-[1] flex-wrap">
                                            <div className="w-32">
                                                <div className="flex items-center gap-1">
                                                    <Star className="inline w-6" size={18} />
                                                    <b className="text-lg">End time:</b>
                                                </div>
                                            </div>
                                            <div className="flex flex-col pl-6 lg:pl-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="inline w-6" size={18} />
                                                    {new Date(myEventDetail!.endTime).toDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="inline w-6" size={18} />
                                                    {printTimeNoSecond(new Date(myEventDetail!.endTime))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1">
                                            <Ticket className="inline w-6" size={18} />
                                            <b className="text-lg">Total vouchers:</b> {myEventDetail?.totalVouchers}
                                        </p>
                                        <div className="grid grid-col-1 md:grid-cols-2 gap-3">
                                            {myEventDetail!.voucherTypes.map((item, index) => (
                                                <VoucherItem key={index} item={item} />
                                            ))}
                                        </div>
                                        <p className="ml-3">
                                            Publised vouchers: {myEventDetail?.totalPublishedVouchers}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1">
                                            <Gamepad2 className="inline w-6" size={18} />
                                            <b className="text-lg">Games:</b>
                                        </p>
                                        <div className="grid grid-col-1 md:grid-cols-2 gap-3">
                                            <RenderGameItemList itemList={myEventDetail!.games} />
                                        </div>
                                    </div>
                                    {myEventDetail?.item && (
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1">
                                                <LayoutGrid className="inline w-6" size={18} />
                                                <b className="text-lg mr-2">Collection items:</b>
                                                <span className={getBadge()}>{` ${
                                                    myEventDetail!.item.numberPieces
                                                } pieces`}</span>
                                            </p>
                                            <ImageGrid
                                                imageUrl={myEventDetail.item.image || defaultEventImage}
                                                items={myEventDetail.item.numberPieces}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-center items-center gap-6">
                                <Button className="cancel-btn-color">
                                    <Link href="/counterpart/event" className="text-base font-normal">
                                        Back
                                    </Link>
                                </Button>
                                <AnimationButton
                                    className="px-3 py-[.37rem] text-white"
                                    onClick={() => {
                                        setUpdate(true);
                                    }}
                                >
                                    Update
                                </AnimationButton>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <UpdateEventForm
                        event={myEventDetail!}
                        back={(refetchData = false) => {
                            setUpdate(!update);
                            if (refetchData) {
                                refetch();
                            }
                        }}
                    />
                </>
            )}
        </>
    );
}
