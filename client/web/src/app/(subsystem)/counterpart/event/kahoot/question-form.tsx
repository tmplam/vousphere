"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function QuestionForm() {
    const [questions, setQuestions] = useState([{ question: "", answers: ["", "", "", ""] }]);

    // Handle input changes
    const handleInputChange = (index: number, field: string, value: string) => {
        const updatedQuestions = [...questions];
        if (field === "question") {
            updatedQuestions[index].question = value;
        } else {
            const answerIndex = parseInt(field);
            updatedQuestions[index].answers[answerIndex] = value;
        }
        setQuestions(updatedQuestions);
    };

    // Add a new question section
    const addQuestion = () => {
        setQuestions([...questions, { question: "", answers: ["", "", "", ""] }]);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            title: (e.target as any).title.value,
            description: (e.target as any).description.value,
            questions,
        };
        console.log("Form Data:", formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
            {/* Title */}
            <div>
                <Label className="block text-sm font-medium mb-1" htmlFor="title">
                    Title
                </Label>
                <Input name="title" id="title" type="text" placeholder="Enter title" required className="bg-white" />
            </div>

            {/* Description */}
            <div>
                <Label className="block text-sm font-medium mb-1" htmlFor="description">
                    Description
                </Label>
                <Textarea
                    name="description"
                    id="description"
                    placeholder="Enter description"
                    required
                    className="bg-white"
                />
            </div>

            {/* Question Sections */}
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor={`question-${index}`}>
                                Question {index + 1}
                            </label>
                            <Input
                                id={`question-${index}`}
                                type="text"
                                placeholder="Enter question"
                                value={q.question}
                                onChange={(e) => handleInputChange(index, "question", e.target.value)}
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {q.answers.map((answer, i) => (
                                <div key={i}>
                                    <Input
                                        type="text"
                                        placeholder={`Answer ${i + 1}`}
                                        value={answer}
                                        onChange={(e) => handleInputChange(index, i.toString(), e.target.value)}
                                        required
                                        className="bg-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <Button type="button" variant="outline" onClick={addQuestion} className="w-full sm:w-1/2">
                    Add Question <Plus />
                </Button>
            </div>
            <Button type="submit" className="w-full">
                Submit
            </Button>
        </form>
    );
}
