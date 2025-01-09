"use client";

import { callRejectEventRequest } from "@/apis/event-api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function RejectEventModal({
    eventId,
    refetchData,
    children,
}: {
    eventId: string;
    refetchData: () => void;
    children: React.ReactNode;
}) {
    const [comment, setComment] = useState<string>("");
    const [errorComment, setErrorComment] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);

    const validateComment = () => {
        if (comment.trim() === "") {
            setErrorComment("Comment cannot be empty");
            return false;
        }
        setErrorComment("");
        return true;
    };

    const handleRejectEvent = async () => {
        let isValidated = validateComment();
        if (!isValidated) return;
        const payload = { comment };
        const result = await callRejectEventRequest(eventId, payload);
        if (result.status == 204) {
            toast({
                title: "Success",
                description: "Event has been rejected",
                duration: 3000,
                className: "bg-sky-500 text-white",
            });
            refetchData();
            setOpenModal(false);
        } else {
            toast({
                title: "Failed",
                description: "Failed to reject the event. Please try again",
                duration: 3000,
                className: "bg-red-500 text-white",
            });
        }
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-gradient">REJECT EVENT</DialogTitle>
                </DialogHeader>
                <div className="mt-0">
                    <p>Tell them why the event will be rejected: </p>
                    <Textarea
                        className="w-full h-32 border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg"
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                        value={comment}
                    ></Textarea>
                    {errorComment && <p className="text-red-500">{errorComment}</p>}
                </div>
                <div className="flex justify-center">
                    <Button className="cancel-btn-color" onClick={handleRejectEvent}>
                        Reject
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
