"use client";
import { RegisterForm } from "@/app/(auth)/register/register-form";
import Link from "next/link";

export default function Register() {
    return (
        <>
            <div className="bg-white rounded-lg border w-[280px] sm:min-w-[400px] p-4">
                <h1 className="text-xl font-semibold text-center">Register</h1>
                <RegisterForm />
                <div className="p-2">
                    <p className="text-center">Already have an account?</p>
                    <div className="flex justify-center">
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
