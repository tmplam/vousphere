"use client";
import InputOTPForm from "@/app/(auth)/verify-otp/opt-form";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OTPVerifyPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    useEffect(() => {
        const emailSaved = localStorage.getItem("emailRegistered");
        if (!emailSaved) {
            toast({
                title: "Error",
                description: "Invalid credentials. Please register!.",
                className: "bg-red-500 text-white",
            });
            router.push("/register");
        }
        setEmail(emailSaved!);
    }, []);
    return (
        <>
            {email != "" ? (
                <div className="rounded-xl w-[330px] sm:min-w-[420px] relative p-[3px] overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-fuchsia-400 z-0 absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin"></div>
                    <div className="bg-white dark:bg-gray-800 relative z-10 rounded-lg p-4">
                        <p className="text-5xl font-bold text-center dynamic-text pb-4">Verify email</p>
                        <InputOTPForm email={email!} />
                        <div className="">
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-gray-300"> or </span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>
                            <div className="flex justify-center gap-2">
                                <p className="text-center">Already have an account?</p>
                                <Link href="/register" className="text-sky-400 hover:underline">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}
