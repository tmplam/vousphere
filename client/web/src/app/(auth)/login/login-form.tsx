"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRequestSchema, LoginRequestDTO } from "@/schema/auth.schema";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { useDispatch } from "react-redux";
import { hasRole, ROLE_ADMIN, ROLE_COUNTERPART, ROLE_PLAYER } from "@/components/shared/authenticatedRoutes";
import { callLoginRequest } from "@/apis/user-api";

export function LoginForm() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const loginForm = useForm<LoginRequestDTO>({
        resolver: zodResolver(LoginRequestSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(values: LoginRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callLoginRequest(values);
            if (result.statusCode == 200 && result.isSuccess) {
                localStorage.setItem("accessToken", result.data.accessToken);
                toast({
                    description: result.message,
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                const userRole = result.data.role.toLowerCase();
                if (hasRole(userRole, ROLE_ADMIN)) {
                    router.push("/admin");
                } else if (hasRole(userRole, ROLE_COUNTERPART)) {
                    router.push("/counterpart");
                } else if (hasRole(userRole, ROLE_PLAYER)) {
                    router.push("/player");
                }
            } else {
                toast({
                    description: result.message,
                    variant: "destructive",
                    duration: 2000,
                    className: "bg-red-500 text-white",
                });
                router.refresh();
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: loginForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-md">Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                    className="!mt-0 border-gray-300 dark:border-white"
                                />
                            </FormControl>
                            {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-md">Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    {...field}
                                    className="!mt-0 border-gray-300 dark:border-white"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    defaultValue="123456"
                />

                <Button
                    type="submit"
                    className="!mt-5 block m-auto bg-gradient-to-br from-sky-400 to-fuchsia-400 transition-all duration-1000 hover:bg-gradient-to-br hover:from-sky-500 hover:to-fuchsia-500"
                >
                    <span className="text-white text-md">Login</span>
                    {loading && <span className="ml-2 animate-spin">⌛</span>}
                </Button>
            </form>
        </Form>
    );
}
