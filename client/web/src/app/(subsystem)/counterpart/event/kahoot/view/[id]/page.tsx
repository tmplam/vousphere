"use client";

import { callDeleteQuizRequest } from "@/apis/game-api";
import { CardSkeleton } from "@/app/(subsystem)/admin/skeletons";
import ErrorPage from "@/app/error";
import { AnimationButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useCachedQuizQuery } from "@/lib/react-query/gameCache";
import { defaultGameImage, getQueryParams } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Check, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function QuizDetail() {
    const router = useRouter();
    const quizId = getQueryParams<string>(useParams(), "id");
    const { data: quiz, isLoading, isError, isPaused } = useCachedQuizQuery(quizId); // Get query status
    if (isError || quiz === null) return <ErrorPage />;
    if (isLoading || isPaused || !quiz) return <CardSkeleton />; // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    if (!isLoading && !quiz) {
        toast({
            title: "Quiz not found",
            description: "Failed to get user information. Please try again later.",
            variant: "destructive",
        });
        return <ErrorPage />;
    }
    const handleDeleteQuiz = async () => {
        const result = await callDeleteQuizRequest(quizId);
        if (result.status == 204) {
            toast({
                title: "Quiz deleted successfully",
                description: "Quiz has been deleted successfully",
                className: "bg-lime-500 text-white",
                duration: 3000,
            });
            window.location.replace("/counterpart/event/kahoot");
        } else {
            toast({
                title: "Failed",
                description: "Failed to delete quiz. Please try again!",
                className: "bg-red-500 text-white",
                variant: "destructive",
            });
        }
    };
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">Quiz information</h1>
            </div>
            <div className="w-[90vw] md:w-[70vw] mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg border border-gray-200 relative">
                <div className="absolute top-1 right-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" className="absolute top-2 right-2 cursor-pointer cancel-btn-color">
                                Delete <Trash className="text-white" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] sm:max-w-[60vw] md:max-w-[40vw] rounded-md">
                            <DialogHeader>
                                <DialogTitle className="text-center text-2xl uppercase text-gradient">
                                    Delete Quiz
                                </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[80vh]">
                                <div className="text-center space-y-4">
                                    <p>Are you sure you want to delete this quiz?</p>
                                    <div className="flex items-center justify-center gap-5 w-full">
                                        <AnimationButton onClick={handleDeleteQuiz} className="px-3 py-[.39rem]">
                                            Delete
                                        </AnimationButton>
                                    </div>
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-2 text-center">
                    <img
                        src={defaultGameImage}
                        alt="Quiz image"
                        className="h-64 max-w-[80%] mx-auto overflow-hidden rounded-lg"
                    />
                    <p className="text-2xl font-semibold">{quiz.name}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">{quiz.description}</p>
                </div>
                <div className="py-2 px-10">
                    <h1 className="font-semibold py-3">Questions:</h1>
                    {quiz.questions.length === 0 && (
                        <div className="text-center text-lg col-span-3">
                            No questions yet. Click on update to add questions.
                        </div>
                    )}
                    {quiz.questions.map((quizQues, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg space-y-2 border bg-white dark:bg-black border-gray-300 hover:scale-[1.01] transition-transform duration-300 cursor-pointer mb-3"
                        >
                            <div className="flex items-center justify-between">
                                <label className="block text-lg font-semibold">📝 Question {index + 1}</label>
                            </div>
                            <p className="text-md font-medium bg-opacity-20 p-3 rounded-md">{quizQues.content}</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {quizQues.options.map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className={`flex items-center space-x-3 w-full p-3 rounded-md border border-gray-200 justify-between
                        ${option.isCorrect ? "bg-lime-500 text-white" : ""} 
                        hover:bg-opacity-80 transition duration-300`}
                                    >
                                        <p className="text-sm">{option.content}</p>
                                        {option.isCorrect && (
                                            <Check className="text-xl" stroke="white" strokeWidth={3} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center py-5 gap-4">
                    <Button className="cancel-btn-color">
                        <Link href="/counterpart/event/kahoot">Back</Link>
                    </Button>
                    <AnimationButton className="px-3 py-[.37rem]">
                        <Link href={`/counterpart/event/kahoot/update/${quiz.id}`}>Update</Link>
                    </AnimationButton>
                </div>
            </div>
        </>
    );
}
