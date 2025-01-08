"use client";

import UpdateQuizForm from "@/app/(subsystem)/counterpart/event/kahoot/update/[id]/update-quiz";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuizCreationPage() {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">Update quiz</h1>
                <Link href="/counterpart/event/kahoot">
                    <Button className="block text-base font-normal !py-0 cancel-btn-color">Back</Button>
                </Link>
            </div>
            <div>
                <UpdateQuizForm />
            </div>
        </>
    );
}
