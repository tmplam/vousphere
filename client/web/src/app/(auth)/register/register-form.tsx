"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { set, useForm } from "react-hook-form";
import { RegisterRequestDTO, RegisterRequestSchema } from "@/schema/auth.schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleErrorApi } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { callRegisterRequest } from "@/apis/user-api";

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    // 1. Define your form.
    const registerForm = useForm<RegisterRequestDTO>({
        resolver: zodResolver(RegisterRequestSchema),
        defaultValues: {
            name: "Software Engineer",
            email: "counterpart@example.com",
            password: "12345678",
            confirmPassword: "12345678",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: RegisterRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callRegisterRequest(values);
            if (result.statusCode == 200) {
                toast({
                    description: "Register successfully",
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                router.push("/login");
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
                setError: registerForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    // 3. Return the form.
    return (
        <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)} noValidate>
                <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="mt-0">
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name"
                                    className="!mt-0 border-gray-300 dark:border-white"
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    className="!mt-0 border-gray-300 dark:border-white"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    className="mt-0 border-gray-300 dark:border-white"
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password again"
                                    className="mt-0 border-gray-300 dark:border-white"
                                    {...field}
                                />
                            </FormControl>
                            {/* <FormDescription>This is your public display name.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="!mt-5 block m-auto bg-gradient-to-br from-sky-400 to-fuchsia-400 transition-all duration-1000 hover:bg-gradient-to-br hover:from-sky-500 hover:to-fuchsia-500"
                >
                    <span className="text-white text-md">Register</span>
                    {loading && <span className="animate-ping">⌛</span>}
                </Button>
            </form>
        </Form>
    );
}
