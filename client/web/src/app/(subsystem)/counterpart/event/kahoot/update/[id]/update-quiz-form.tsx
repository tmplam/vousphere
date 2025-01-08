"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";
import { AnimationButton } from "@/components/shared/custom-button";
import { callCreateQuizQuestionRequest, callUpdateQuizQuestionRequest } from "@/apis/game-api";
import { QuestionType } from "@/schema/game.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function UpdateQuizQuestionForm({
    quizId,
    quizQuestion,
    quizQuestionId,
    refetchQuizzes,
    children,
}: {
    quizId: string;
    quizQuestionId: string;
    quizQuestion: QuestionType;
    refetchQuizzes: () => void;
    children: React.ReactNode;
}) {
    const [question, setQuestion] = useState<QuestionType>(quizQuestion);
    const [questionError, setQuestionError] = useState<string>("");
    const [answerError, setAnswerError] = useState<string>("");
    const [openUpdateQuizModal, setOpenUpdateQuizModal] = useState<boolean>(false);

    const validateQuestion = () => {
        if (!question.content) {
            setQuestionError("Question must not be empty.");
            return false;
        }
        setQuestionError("");
        return true;
    };

    const validateAnswer = () => {
        if (question.options.some((answer) => answer.content.trim() === "")) {
            setAnswerError("All answers must not be empty.");
            return false;
        }
        setAnswerError("");
        return true;
    };

    // Handle input changes
    const handleInputChange = (answerIndex: number, field: string, value: string) => {
        setQuestionError("");
        setAnswerError("");
        const updatedQuestion = { ...question };
        if (field === "question") {
            updatedQuestion.content = value;
        } else if (field === "answer") {
            updatedQuestion.options[answerIndex].content = value;
        }
        setQuestion(updatedQuestion);
    };

    const getCheckedIndex = (e: React.FormEvent): number => {
        const form = e.target as HTMLFormElement;
        const radioAnswerInput = Array.from(form.elements).filter(
            (element) =>
                (element as HTMLInputElement).type === "radio" && (element as HTMLInputElement).name === "answer"
        );
        return radioAnswerInput.findIndex((element) => (element as HTMLInputElement).checked);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValidated = validateQuestion();
        isValidated &&= validateAnswer();
        if (!isValidated) {
            return;
        }
        const checkedIndex = getCheckedIndex(e);
        const answerPayload = question.options.map((answer, index) => ({
            ...answer,
            isCorrect: index === checkedIndex,
        }));
        const payload = {
            content: question.content,
            options: answerPayload.map((answer) => {
                return {
                    content: answer.content,
                    isCorrect: answer.isCorrect,
                };
            }),
        };
        console.log(payload);
        const result = await callUpdateQuizQuestionRequest(quizId, quizQuestionId, payload);
        if (result.status == 200) {
            toast({
                description: "Update quiz question successfully",
                duration: 3000,
                className: "bg-lime-500 text-white",
            });
            await refetchQuizzes();
            setOpenUpdateQuizModal(false);
        } else {
            toast({
                description: "Update quiz question failed. Please try again",
                duration: 3000,
                className: "bg-red-500 text-white",
            });
        }
    };

    const handleAddAnswerInput = () => {
        const updatedQuestion = { ...question };
        updatedQuestion.options.push({
            id: "",
            content: "",
            isCorrect: false,
        });
        setQuestion(updatedQuestion);
    };

    const handleDeleteAnswerInput = (index: number) => {
        const updatedQuestion = { ...question };
        updatedQuestion.options.splice(index, 1);
        setQuestion(updatedQuestion);
    };

    const resetForm = () => {
        setQuestion(quizQuestion);
        setQuestionError("");
        setAnswerError("");
    };

    return (
        <>
            <Dialog open={openUpdateQuizModal} onOpenChange={setOpenUpdateQuizModal}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="max-w-[80vw] sm:max-w-[60vw] md:max-w-[70vw] lg:max-w-[70vw] xl:max-w-[60vw] rounded-md border border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl uppercase text-gradient">update quiz</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        <form onSubmit={handleSubmit} className="mx-auto p-4" noValidate>
                            <div className="space-y-4">
                                <div className="border p-4 rounded-lg space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Question name</label>
                                        <Input
                                            type="text"
                                            placeholder="Enter question"
                                            value={question.content}
                                            name="content"
                                            onChange={(e) => handleInputChange(0, "question", e.target.value)}
                                            required
                                            className="bg-white dark:bg-black border-gray-200"
                                        />
                                        {questionError && <p className="text-sm text-red-500">{questionError}</p>}
                                    </div>
                                    <label className="block text-sm font-medium mb-1">Answers</label>
                                    <div className="grid lg:grid-cols-2 gap-x-5 gap-y-3">
                                        {question.options.map((answer, index) => (
                                            <div key={index} className="relative">
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        type="radio"
                                                        name="answer"
                                                        className="w-6 h-6 px-2"
                                                        defaultChecked={answer.isCorrect}
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter the answer"
                                                        value={answer.content}
                                                        onChange={(e) =>
                                                            handleInputChange(index, "answer", e.target.value)
                                                        }
                                                        required
                                                        className="bg-whitedark:bg-black border-gray-200 pr-8 flex-[1]"
                                                    />
                                                </div>
                                                <Trash
                                                    stroke="red"
                                                    onClick={() => handleDeleteAnswerInput(index)}
                                                    className="absolute top-2 right-0 w-8 h-5 cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleAddAnswerInput}
                                        className="border border-gray-200 rounded-full"
                                    >
                                        Add answer <Plus />
                                    </Button>
                                    {answerError && <p className="text-sm text-red-500">{answerError}</p>}
                                </div>
                            </div>

                            <div className="flex justify-center items-center mt-3 gap-5">
                                <Button
                                    type="button"
                                    className="px-4 py-2 text-md cancel-btn-color"
                                    onClick={resetForm}
                                >
                                    Reset
                                </Button>
                                <AnimationButton type="submit" className="px-4 py-[.39rem]">
                                    Submit
                                </AnimationButton>
                            </div>
                        </form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
