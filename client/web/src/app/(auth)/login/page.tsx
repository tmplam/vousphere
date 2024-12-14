"use client";
import { LoginForm } from "@/app/(auth)/login/login-form";
import Link from "next/link";

export default function Login() {
    return (
        <>
            <div className="bg-white rounded-lg border w-[280px] sm:min-w-[400px] p-4">
                <h1 className="text-xl font-semibold text-center">Login</h1>
                <LoginForm />
                <div className="p-2">
                    <p className="text-center">Already have an account?</p>
                    <div className="flex justify-center">
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
