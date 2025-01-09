"use client";

import QuizForm from "@/app/(subsystem)/counterpart/event/kahoot/create/quiz-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function QuizCreationPage() {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">Add new quiz</h1>
                <Link href="/counterpart/event/kahoot">
                    <Button className="block text-base font-normal !py-0 cancel-btn-color">Back</Button>
                </Link>
            </div>
            <div>
                <QuizForm />
            </div>
        </>
    );
}
