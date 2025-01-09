"use client";
import { callApproveEventRequest, callRejectEventRequest } from "@/apis/event-api";
import { getBadgeCSS } from "@/app/(subsystem)/admin/event/event-status-badge";
import RejectEventModal from "@/app/(subsystem)/admin/event/reject-event-modal";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import GameItem, { RenderGameItemList } from "@/app/(subsystem)/counterpart/event/detail/[id]/view-game-item";
import VoucherItem from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-item";
import ImageGrid from "@/app/(subsystem)/counterpart/event/new-event/image-grid";
import { AnimationButton } from "@/components/shared/custom-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { defaultEventImage, printTimeNoSecond } from "@/lib/utils";
import { EventGameType } from "@/schema/event.schema";
import { Ban, Calendar, Clock, Gamepad2, LayoutGrid, Star, Ticket } from "lucide-react";
import React from "react";

const ViewAndActionForEvent: React.FC<{
    eventDetail: EventGameType;
    refetchData: () => void;
    children: React.ReactNode;
}> = ({ eventDetail, refetchData, children }) => {
    const [openModal, setOpenModal] = React.useState(false);
    const handleAcceptEvent = async () => {
        const result = await callApproveEventRequest(eventDetail.id);
        if (result.status == 204) {
            toast({
                title: "Success",
                description: "Event has been approved",
                duration: 3000,
                className: "bg-sky-500 text-white",
            });
            refetchData();
            setOpenModal(false);
        } else {
            toast({
                title: "Failed",
                description: "Failed to approve the event. Please try again",
                duration: 3000,
                className: "bg-red-500 text-white",
            });
        }
    };
    return (
        <>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogTrigger asChild className="cursor-pointer mx-auto">
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] lg:max-w-[70vw] border border-gray-200 !px-1 !py-3">
                    <DialogHeader>
                        <DialogTitle className="text-center text-3xl text-gradient">Event info</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="px-3 mx-auto max-h-[70vh] w-full">
                        <div className="space-y-4 shadow-md border shadow-gray-100 rounded-md dark:bg-slate-800 bg-white mx-auto py-3">
                            <div className="flex justify-center items-center w-[80%] md:w-[70%] h-64 h-70 sm:h-80 lg:h-96 overflow-hidden rounded-lg mx-auto border">
                                <img
                                    src={eventDetail?.image || defaultEventImage}
                                    alt={eventDetail!.name}
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover border shadow-md rounded-lg"
                                />
                            </div>
                            <div className="px-4 sm:px-8 xl:px-12 border-t border-t-gray-200 pt-2">
                                <div className="flex flex-col w-full space-y-2">
                                    <div className="text-xl sm:text-2xl font-thin">
                                        <b className="font-semibold">Event name:</b> {eventDetail!.name}
                                    </div>
                                    <div className="text-lg">
                                        <b>Description: </b>
                                        <span className="text-md">{eventDetail!.description}</span>
                                    </div>
                                    <div className="text-lg">
                                        <b>Status: </b>
                                        <span className="text-md -translate-y-[.2rem] inline-block ml-1">
                                            {getBadgeCSS(eventDetail!.status)}
                                        </span>
                                    </div>
                                    {eventDetail?.comment && eventDetail.status == "Rejected" && (
                                        <div className="text-lg">
                                            <b>Reason rejected: </b>
                                            <span className="text-md text-red-600 dark:text-rose-500">
                                                {eventDetail!.comment}
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
                                                    {new Date(eventDetail!.startTime).toDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="inline w-6" size={18} />
                                                    {printTimeNoSecond(new Date(eventDetail!.startTime))}
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
                                                    {new Date(eventDetail!.endTime).toDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="inline w-6" size={18} />
                                                    {printTimeNoSecond(new Date(eventDetail!.endTime))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-1">
                                            <Ticket className="inline w-6" size={18} />
                                            <b className="text-lg">Total vouchers:</b> {eventDetail?.totalVouchers}
                                        </p>
                                        <div className="grid grid-col-1 md:grid-cols-2 gap-3">
                                            {eventDetail!.voucherTypes.map((item, index) => (
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
                                            {/* {eventDetail!.games.map((item, index) => (
                                                <GameItem key={index} item={item} />
                                            ))} */}
                                            <RenderGameItemList itemList={eventDetail!.games} />
                                        </div>
                                    </div>
                                    {eventDetail.item && (
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1">
                                                <LayoutGrid className="inline w-6" size={18} />
                                                <b className="text-lg mr-2">Collection items:</b>
                                                <span
                                                    className={getBadge()}
                                                >{` ${eventDetail.item.numberPieces} pieces`}</span>
                                            </p>
                                            <ImageGrid
                                                imageUrl={eventDetail.item.image || defaultEventImage}
                                                items={eventDetail.item.numberPieces}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    {eventDetail.status === "Created" && (
                        <>
                            <div className="flex justify-center items-center gap-6 border-t border-t-gray-200 pt-3">
                                <RejectEventModal eventId={eventDetail.id} refetchData={refetchData}>
                                    <Button className="cancel-btn-color text-md px-3 py-2">Reject</Button>
                                </RejectEventModal>
                                <AnimationButton className="px-3 py-[.38rem]" onClick={() => handleAcceptEvent()}>
                                    Accept
                                </AnimationButton>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewAndActionForEvent;
