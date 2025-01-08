"use client";
import { GameListSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import QuestionForm from "@/app/(subsystem)/counterpart/event/kahoot/create/quiz-form";
import ErrorPage from "@/app/error";
import AnimationColorfulButton, { AnimationButton } from "@/components/shared/custom-button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCachedQuizListQuery } from "@/lib/react-query/eventCache";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function QuizQuestionsEventPage() {
    const { data: quizAndQuestionList, isLoading, isError, isPaused } = useCachedQuizListQuery();
    if (isError || quizAndQuestionList === null) return <ErrorPage />;
    if (isLoading || isPaused || !quizAndQuestionList)
        return (
            <>
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">Game Management</h1>
                <GameListSkeleton total={2} />
            </>
        );
    console.log(quizAndQuestionList.data);
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">My Quizzes</h1>
                <Link href="/counterpart/event/kahoot/create">
                    <AnimationButton className="py-[.37rem] px-3 flex items-center">
                        Create quiz <Gamepad2 size={20} className="translate-y-[.17rem]" />
                    </AnimationButton>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-5 dark:text-white">
                {quizAndQuestionList.data.length === 0 && (
                    <div className="text-center text-lg font-semibold col-span-3">
                        No quiz found. Click on create quiz to create a new quiz.
                    </div>
                )}
                {quizAndQuestionList.data.map((quizQues, index) => (
                    <Card
                        className="w-full max-w-md border shadow-sm hover:shadow-md transition-all shadow-slate-50 dark:hover:shadow-slate-50 rounded-lg"
                        key={index}
                    >
                        <CardHeader className="relative !p-0">
                            <img
                                src={
                                    "https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg"
                                }
                                alt="Game"
                                className="h-48 w-full object-cover rounded-t"
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-2 text-lg font-bold w-full">
                                <span className="line-clamp-1 text-center">{quizQues.name}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-1 p-4">
                            {/* <div className="text-sm flex items-center gap-3">
                                <span className="font-semibold">Game type:</span>
                                <span className={`${getBadge()} capitalize`}>{quizQues.type}</span>
                            </div> */}
                            <div className="text-sm h-12">
                                <span className="font-semibold">Guide:</span>{" "}
                                <span className=" line-clamp-2">{quizQues.description}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-center !p-3">
                            <Link href={`/counterpart/event/kahoot/view/${quizQues.id}`}>
                                <AnimationColorfulButton className="px-3 py-1">View details</AnimationColorfulButton>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>{" "}
        </>
    );
}
