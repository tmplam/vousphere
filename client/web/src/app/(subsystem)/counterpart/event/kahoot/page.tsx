"use client";
import QuestionForm from "@/app/(subsystem)/counterpart/event/kahoot/question-form";

export default function QuestionsEvent() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">Event</h1>
            </div>
            <div className="p-3">
                <QuestionForm />
            </div>
        </div>
    );
}
