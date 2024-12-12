"use client";
import { Button } from "@/components/ui/button";

export default function Custom404PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-4xl font-bold text-blue-600">404 - Page Not Found</h1>
            <p className="mt-4 text-gray-700">The page you are looking for doesn't exist or has been moved.</p>
            <Button className="mt-6" onClick={() => window.history.back()}>
                Back
            </Button>
        </div>
    );
}
