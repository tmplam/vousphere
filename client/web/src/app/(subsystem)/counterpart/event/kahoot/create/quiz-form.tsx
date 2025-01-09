"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateQuizRequestDTO, CreateQuizRequestSchema, QuestionType, QuizType } from "@/schema/game.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { callCreateQuizRequest, callUpdateQuizRequest } from "@/apis/game-api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AnimationButton } from "@/components/shared/custom-button";
import { useRouter } from "next/navigation";

export default function QuizForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // Create new Quiz
    const createQuizForm = useForm<CreateQuizRequestDTO>({
        resolver: zodResolver(CreateQuizRequestSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // 2. Define a submit handler for create quiz.
    async function onCreateQuizSubmit(values: CreateQuizRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callCreateQuizRequest(values);
            if (result.statusCode == 201 && result.isSuccess) {
                toast({
                    description: result.message,
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                setLoading(false);
                router.push("/counterpart/event/kahoot/update/" + result.data.quizId);
            } else {
                toast({
                    description: result.message,
                    variant: "destructive",
                    duration: 3000,
                    className: "bg-red-500 text-white",
                });
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: createQuizForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...createQuizForm}>
                <form onSubmit={createQuizForm.handleSubmit(onCreateQuizSubmit)} className="p-2 md:p-4" noValidate>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <FormField
                                control={createQuizForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter quiz name"
                                                {...field}
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
                                control={createQuizForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter quiz description"
                                                {...field}
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
                    <div className="flex items-center justify-center mt-5 gap-5">
                        <AnimationButton type="submit" className="px-4 py-[.37rem]">
                            Create
                        </AnimationButton>
                    </div>
                </form>
            </Form>
        </>
    );
}
