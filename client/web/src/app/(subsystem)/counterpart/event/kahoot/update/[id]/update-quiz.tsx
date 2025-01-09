"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuestionType, UpdateQuizRequestDTO, UpdateQuizRequestSchema } from "@/schema/game.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { getQueryParams, handleErrorApi } from "@/lib/utils";
import { callUpdateQuizRequest, getQuizById, getQuizQuestionById } from "@/apis/game-api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AnimationButton } from "@/components/shared/custom-button";
import { useParams } from "next/navigation";
import CreateQuizForm from "@/app/(subsystem)/counterpart/event/kahoot/update/[id]/create-quiz-form";
import { Check, CircleX, Plus, SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import UpdateQuizQuestionForm from "@/app/(subsystem)/counterpart/event/kahoot/update/[id]/update-quiz-form";
import DeleteQuizModal from "@/app/(subsystem)/counterpart/event/kahoot/update/[id]/delete-quiz-modal";
import Link from "next/link";

export default function UpdateQuizForm() {
    const [loading, setLoading] = useState(false);
    const [openAddQuizModal, setOpenAddQuizModal] = useState(false);
    const [quizQuestionList, setQuizQuestionList] = useState<QuestionType[]>([]);
    const quizId = getQueryParams<string>(useParams(), "id");

    const updateQuizForm = useForm<UpdateQuizRequestDTO>({
        resolver: zodResolver(UpdateQuizRequestSchema),
        defaultValues: {
            name: "",
            description: "",
            quizId: quizId,
        },
    });

    const fetchQuizzes = async () => {
        const result = await getQuizById(quizId);
        if (!result) {
            throw new Error("Quiz not found for id" + quizId);
        }
        updateQuizForm.reset(result);
        setQuizQuestionList(result.questions);
    };

    useEffect(() => {
        fetchQuizzes();
    }, [quizId]);

    async function onUpateQuizSubmit(values: UpdateQuizRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callUpdateQuizRequest(values);
            if (result.statusCode == 200 && result.isSuccess) {
                console.log(result.data);
                toast({
                    description: result.message,
                    duration: 3000,
                    className: "bg-lime-500 text-white",
                });
                setLoading(false);
            } else {
                toast({
                    description: result.message,
                    variant: "destructive",
                    duration: 2000,
                    className: "bg-red-500 text-white",
                });
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: updateQuizForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Form {...updateQuizForm}>
                <form onSubmit={updateQuizForm.handleSubmit(onUpateQuizSubmit)} className="p-2 md:p-4" noValidate>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <FormField
                                control={updateQuizForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your name"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="!mt-0 border-gray-200 bg-white dark:bg-black"
                                            />
                                        </FormControl>
                                        {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={updateQuizForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter quiz description"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="!mt-0 border-gray-200 bg-white dark:bg-black"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-5">
                        <AnimationButton type="submit" className="px-4 py-[.37rem]">
                            Update
                        </AnimationButton>
                    </div>
                </form>
            </Form>
            <div className="pt-2 lg:max-w-[60vw] mx-auto bg-white dark:bg-black p-4 rounded-lg">
                <label className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 block my-2 ">
                    Question
                </label>
                {quizQuestionList.map((quizQues, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-lg space-y-2 border bg-white dark:bg-black border-gray-300 hover:scale-[1.01] transition-transform duration-300 cursor-pointer mb-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="block text-lg font-semibold">📝 Question {index + 1}</label>
                            <div className="flex items-center gap-4">
                                <UpdateQuizQuestionForm
                                    key={index}
                                    quizId={quizId}
                                    quizQuestion={quizQues}
                                    quizQuestionId={quizQues.id}
                                    refetchQuizzes={fetchQuizzes}
                                >
                                    <SquarePen className="text-lime-500" strokeWidth={2} />
                                </UpdateQuizQuestionForm>
                                <DeleteQuizModal
                                    quizId={quizId}
                                    quizQuestionId={quizQues.id}
                                    refetchQuizzes={fetchQuizzes}
                                >
                                    <CircleX className="text-red-500" strokeWidth={3} />
                                </DeleteQuizModal>
                            </div>
                        </div>
                        <p className="text-md font-medium bg-opacity-20 p-3 rounded-md">{quizQues.content}</p>
                        <div className="grid grid-cols-2 gap-4">
                            {quizQues.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    className={`flex items-center space-x-3 w-full p-3 rounded-md border border-gray-200 justify-between
                        ${option.isCorrect ? "bg-lime-500 text-white" : ""} 
                        hover:bg-opacity-80 transition duration-300`}
                                >
                                    <p className="text-sm">{option.content}</p>
                                    {option.isCorrect && <Check className="text-xl" stroke="white" strokeWidth={3} />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <Dialog open={openAddQuizModal} onOpenChange={setOpenAddQuizModal}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="px-4 py-1 rounded-full border border-gray-200"
                        >
                            Add Question <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[80vw] sm:max-w-[60vw] md:max-w-[70vw] lg:max-w-[70vw] xl:max-w-[60vw] rounded-md border border-gray-200">
                        <DialogHeader>
                            <DialogTitle className="text-center text-2xl uppercase text-gradient">Add quiz</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[80vh]">
                            <CreateQuizForm
                                quizId={quizId}
                                closeModal={() => setOpenAddQuizModal(false)}
                                refetchQuizzes={fetchQuizzes}
                            />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                {quizQuestionList.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <Link href={`/counterpart/event/kahoot/view/${quizId}`}>
                            <AnimationButton className="px-4 py-2">
                                View Quiz <Check strokeWidth={2} />
                            </AnimationButton>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
