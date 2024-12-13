"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
                <h1 className="text-4xl font-bold text-blue-600">Please login to continue</h1>
                <Button className="mt-6">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
    );
}
