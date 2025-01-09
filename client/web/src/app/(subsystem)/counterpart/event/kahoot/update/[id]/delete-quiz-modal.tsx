"use client";

import { callDeleteQuizQuestionRequest } from "@/apis/game-api";
import { AnimationButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function DeleteQuizModal({
    quizId,
    quizQuestionId,
    refetchQuizzes,
    children,
}: {
    quizId: string;
    quizQuestionId: string;
    refetchQuizzes: () => void;
    children: React.ReactNode;
}) {
    const [openModal, setOpenModal] = useState(false);
    const handleDeleteQuizQuestion = async () => {
        const result = await callDeleteQuizQuestionRequest(quizId, quizQuestionId);
        if (result.status == 204) {
            toast({
                description: "Create quiz question successfully",
                duration: 3000,
                className: "bg-lime-500 text-white",
            });
            await refetchQuizzes();
            setOpenModal(false);
        } else {
            toast({
                description: "Create quiz question failed. Please try again",
                duration: 3000,
                className: "bg-red-500 text-white",
            });
        }
    };
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[60vw] md:max-w-[40vw] rounded-md border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl uppercase text-gradient">Delete Quiz</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    <div className="text-center space-y-4">
                        <p>Are you sure you want to delete this quiz?</p>
                        <div className="flex items-center justify-center gap-5 w-full">
                            <AnimationButton onClick={handleDeleteQuizQuestion} className="px-3 py-[.39rem]">
                                Delete
                            </AnimationButton>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
