"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";
import { AnimationButton } from "@/components/shared/custom-button";
import { callCreateQuizQuestionRequest } from "@/apis/game-api";

export default function CreateQuizForm({
    quizId,
    closeModal,
    refetchQuizzes,
}: {
    quizId: string;
    closeModal: () => void;
    refetchQuizzes: () => void;
}) {
    const [question, setQuestion] = useState({ content: "", answers: ["", "", "", ""] });
    const [questionError, setQuestionError] = useState<string>("");
    const [answerError, setAnswerError] = useState<string>("");

    const validateQuestion = () => {
        if (!question.content) {
            setQuestionError("Question must not be empty.");
            return false;
        }
        setQuestionError("");
        return true;
    };

    const validateAnswer = () => {
        if (question.answers.some((answer) => answer.trim() === "")) {
            setAnswerError("All answers must not be empty.");
            return false;
        }
        setAnswerError("");
        return true;
    };

    const validateCorrectAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if any input radio named "answer" is checked
        const form = e.target as HTMLFormElement;
        const isChecked = Array.from(form.elements).some(
            (element) =>
                (element as HTMLInputElement).type === "radio" &&
                (element as HTMLInputElement).name === "answer" &&
                (element as HTMLInputElement).checked
        );
        if (!isChecked) {
            setAnswerError("Must specify at least one correct answer.");
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
            updatedQuestion.answers[answerIndex] = value;
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
        isValidated &&= validateCorrectAnswer(e);
        if (!isValidated) {
            return;
        }
        const checkedIndex = getCheckedIndex(e);
        const answerPayload = question.answers.map((answer, index) => ({
            content: answer,
            isCorrect: index === checkedIndex,
        }));
        const payload = {
            content: question.content,
            options: answerPayload,
        };
        const result = await callCreateQuizQuestionRequest(quizId, payload);
        if (result.status == 201) {
            toast({
                description: "Create quiz question successfully",
                duration: 3000,
                className: "bg-lime-500 text-white",
            });
            await refetchQuizzes();
            closeModal();
        } else {
            toast({
                description: "Create quiz question failed. Please try again",
                duration: 3000,
                className: "bg-red-500 text-white",
            });
        }
    };

    const handleAddAnswerInput = () => {
        const updatedQuestion = { ...question };
        updatedQuestion.answers.push("");
        setQuestion(updatedQuestion);
    };

    const handleDeleteAnswerInput = (index: number) => {
        const updatedQuestion = { ...question };
        updatedQuestion.answers.splice(index, 1);
        setQuestion(updatedQuestion);
    };

    const resetForm = () => {
        setQuestion({ content: "", answers: ["", "", "", ""] });
        setQuestionError("");
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="mx-auto p-4 border border-gray-200 rounded-lg" noValidate>
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
                            {question.answers.map((answer, index) => (
                                <div key={index} className="relative">
                                    <div className="flex items-center gap-1">
                                        <Input type="radio" name="answer" className="w-6 h-6 px-2" />
                                        <Input
                                            type="text"
                                            placeholder="Enter the answer"
                                            value={answer}
                                            onChange={(e) => handleInputChange(index, "answer", e.target.value)}
                                            required
                                            className="bg-white dark:bg-black border-gray-200 pr-8 flex-[1]"
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
                    <Button type="button" className="px-4 py-2 text-md cancel-btn-color" onClick={resetForm}>
                        Reset
                    </Button>
                    <AnimationButton type="submit" className="px-4 py-[.39rem]">
                        Submit
                    </AnimationButton>
                </div>
            </form>
        </>
    );
}
