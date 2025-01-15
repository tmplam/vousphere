"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { SendOTPRequestDTO, OTPSchema, SentOTPResponseDTO } from "@/schema/auth.schema";
import { callReSendOTPRequest, callSendOTPRequest } from "@/apis/user-api";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function InputOTPForm({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const optForm = useForm<SendOTPRequestDTO>({
        resolver: zodResolver(OTPSchema),
        defaultValues: {
            otpCode: "",
            email: email!,
        },
    });

    async function onSubmit(values: SendOTPRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callSendOTPRequest(values);
            if (result.statusCode == 200 && result.isSuccess) {
                // console.log(result);
                localStorage.removeItem("emailRegistered");
                toast({
                    description: result.message,
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                localStorage.setItem("accessToken", result.data.accessToken);
                // console.log(result.data);
                if (result.data.role.toLowerCase() == "admin") {
                    router.push("/admin");
                } else if (result.data.role.toLowerCase() == "brand") {
                    router.push("/counterpart");
                }
            } else {
                // console.log(result);
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
                setError: optForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    async function resendOTP(emailResend: string) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callReSendOTPRequest({ email: emailResend });
            console.log(result);
            toast({
                title: "Success",
                description: "Resend OTP successfully. Please check your email!",
                className: "bg-lime-500 text-white",
            });
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: optForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...optForm}>
            <form onSubmit={optForm.handleSubmit(onSubmit)}>
                <FormField
                    control={optForm.control}
                    name="otpCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Verify email for "<b>{email}</b>"
                            </FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field} tabIndex={0} autoFocus>
                                    <InputOTPGroup className="justify-center overflow-hidden p-1 w-full">
                                        <InputOTPSlot index={0} className="border border-gray-200 w-12 h-14" />
                                        <InputOTPSlot index={1} className="border border-gray-200 w-12 h-14" />
                                        <InputOTPSlot index={2} className="border border-gray-200 w-12 h-14" />
                                        <InputOTPSlot index={3} className="border border-gray-200 w-12 h-14" />
                                        <InputOTPSlot index={4} className="border border-gray-200 w-12 h-14" />
                                        <InputOTPSlot index={5} className="border border-gray-200 w-12 h-14" />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>Please enter the one-time password sent to your mail.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex py-4 justify-center gap-5">
                    <Button type="button" onClick={(e) => resendOTP(email)}>
                        Resend OTP
                    </Button>
                    <Button
                        type="submit"
                        className="py-1 px-4 z-0 bg-gradient-to-br from-sky-400 to-fuchsia-400 transition-all duration-1000 hover:bg-gradient-to-br hover:from-sky-500 hover:to-fuchsia-500 text-white"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
}
