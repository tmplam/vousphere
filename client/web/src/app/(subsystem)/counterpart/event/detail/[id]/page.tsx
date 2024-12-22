"use client";

import UpdateEventForm from "@/app/(subsystem)/counterpart/event/detail/[id]/update-event-form";
import ViewGameModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-game-modal";
import ViewVoucherModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-modal";
import { VoucherAmount } from "@/app/(subsystem)/counterpart/event/new-event/page";
import { MyEventDetailsSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import ErrorPage from "@/app/error";
import { AnimationButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCachedMyEventDetailQuery } from "@/lib/react-query/eventCache";
import { getQueryParams, printTimeNoSecond } from "@/lib/utils";
import { VoucherEventType } from "@/schema/event.schema";
import { GameType } from "@/schema/game.schema";
import { Calendar, Clock, Gamepad, Gamepad2, Info, Star, Ticket } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EventDetails() {
    const [update, setUpdate] = useState<boolean>(false);
    const eventId = getQueryParams<number>(useParams(), "id");
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
    const totalNumOfVouchers = myEventDetail!.vouchers.reduce((prev, curr) => prev + curr.amount, 0);
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">{!update ? "Event detail" : "Update event detail"}</h1>
            </div>
            {!update ? (
                <>
                    <div className="p-3 w-[90vw] sm:w-[80vw] lg:w-[60vw] mx-auto">
                        <div className="space-y-4 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white mx-auto py-3">
                            <div className="flex justify-center items-center w-[85%] md:w-[80%] h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg mx-auto">
                                <img
                                    src={myEventDetail!.image}
                                    alt={myEventDetail!.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full border shadow-md"
                                />
                            </div>
                            <div className="px-4 sm:px-8 xl:px-12">
                                <div className="flex flex-col w-full space-y-2">
                                    <div className="text-xl sm:text-2xl font-thin">
                                        <b className="font-semibold">Event name:</b> {myEventDetail!.name}
                                    </div>
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
                                            <b className="text-lg">Total vouchers:</b> {totalNumOfVouchers}
                                        </p>
                                        <div className="grid grid-col-1 md:grid-cols-2 gap-3">
                                            {myEventDetail!.vouchers.map((item, index) => (
                                                <VoucherItem key={index} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1">
                                            <Gamepad2 className="inline w-6" size={18} />
                                            <b className="text-lg">Games:</b>
                                        </p>
                                        <div className="grid grid-col-1 md:grid-cols-2 gap-3">
                                            {myEventDetail!.games.map((item, index) => (
                                                <GameItem key={index} item={item} />
                                            ))}
                                        </div>
                                    </div>
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

function VoucherItem({ item }: { item: VoucherEventType }) {
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img
                    src={
                        item.voucher.image
                            ? item.voucher.image
                            : "https://agencyvn.com/wp-content/uploads/2019/05/Voucher-l%C3%A0-g%C3%AC.jpg"
                    }
                    alt="Voucher image"
                    className="w-full h-full object-cover border"
                />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">
                    Discount <span className="dynamic-text text-lg">{item.voucher.value}%</span>
                </p>
                <span className="text-xs line-clamp-2 min-h-[1.8rem]">{item.voucher.description}</span>
                <span className="text-sm">
                    Quantity: <b>{item.amount}</b>
                </span>
            </div>
            <div className="flex items-center gap-4 px-3">
                <ViewVoucherModal item={item}>
                    <Info color="blue" strokeWidth={3} className="cursor-pointer" />
                </ViewVoucherModal>
            </div>
        </div>
    );
}

function GameItem({ item }: { item: GameType }) {
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img src={item.image} alt="Voucher image" className="w-full h-full object-cover border" />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">
                    <span className="dynamic-text text-lg">{item.name}</span>
                </p>
                <span className="text-xs line-clamp-3 min-h-[3rem]">{item.guide}</span>
            </div>
            <div className="flex items-center gap-4 px-3">
                <ViewGameModal item={item}>
                    <Info color="blue" strokeWidth={3} className="cursor-pointer" />
                </ViewGameModal>
            </div>
        </div>
    );
}
