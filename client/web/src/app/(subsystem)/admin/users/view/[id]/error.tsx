"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const { toast } = useToast();
    // console.clear(); // Clear console

    return (
        <div className="flex justify-center items-center min-h-screen flex-col gap-4">
            <h3 className="text-4xl font-normal">Something went wrong!</h3>
            <p>{error?.message || "Unexpected error! Please try again."}</p>
            <Button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    );
}
