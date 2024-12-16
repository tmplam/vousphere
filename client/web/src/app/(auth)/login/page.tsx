"use client";
import { LoginForm } from "@/app/(auth)/login/login-form";
import Link from "next/link";

export default function Login() {
    return (
        <div className="rounded-xl w-[330px] sm:min-w-[420px] relative p-[3px] overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-fuchsia-400 z-0 absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-spin"></div>
            <div className="bg-white dark:bg-gray-800 relative z-10 rounded-lg p-4">
                <p className="text-5xl font-bold text-center dynamic-text pb-2">Login</p>
                <LoginForm />
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
    );
}
