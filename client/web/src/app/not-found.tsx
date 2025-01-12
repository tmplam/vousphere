"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Custom404PageNotFound() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black text-center">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-500">404 - Page Not Found</h1>
            <p className="mt-4 text-gray-700 dark:text-white">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button className="mt-6" onClick={() => router.back()}>
                Back
            </Button>
        </div>
    );
}
