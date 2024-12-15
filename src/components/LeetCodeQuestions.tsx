"use client";
import React, { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import usePlatformAPI from "@/fetchAPI/usePlatformAPI";
import Link from "next/link";
import { Link2 } from "lucide-react";

interface Question {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
    difficulty: "Easy" | "Medium" | "Hard";
}

const LeetCodeQuestions = ({ username }: any) => {
    const { getLeetCodeQuestionSolved } = usePlatformAPI();

    const [leetCodeQuestions, setLeetCodeQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<{
        [key: string]: Question[];
    }>({
        Easy: [],
        Medium: [],
        Hard: [],
    });

    const handleGetCommits = async () => {
        if (!username) return
        if (leetCodeQuestions.length > 0) return;

        try {
            const data: Question[] = await getLeetCodeQuestionSolved(username);
            setLeetCodeQuestions(data);

            setFilteredQuestions({
                Easy: data.filter((item) => item.difficulty === "Easy"),
                Medium: data.filter((item) => item.difficulty === "Medium"),
                Hard: data.filter((item) => item.difficulty === "Hard"),
            });
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const renderQuestions = (difficulty: string) => {
        const questions = filteredQuestions[difficulty];
        if (questions.length === 0) {
            return (
                <AccordionContent className="py-2">
                    <div>No questions solved</div>
                </AccordionContent>
            );
        }

        return questions.map((question, index) => (
            <AccordionContent className="" key={question.id || index}>
                <div className="flex gap-2 border-b py-2 text-neutral-400">
                    <Link href={`https://leetcode.com/problems/${question.titleSlug}`} target="_blank">
                        <span className="font-semibold">Question:</span> {question.title}
                    </Link>
                    <Link2/>
                </div>
            </AccordionContent>
        ));
    };

    return (
        <div className="border-[1px] border-neutral-900 p-2 px-4 rounded-[8px]">
            <Accordion type="single" collapsible>
                <AccordionItem value="all-commits" className="border-none">
                    <AccordionTrigger onClick={handleGetCommits}>
                        <div className="flex gap-[2rem]">Solved Questions</div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-[2rem]">
                        {["Hard", "Medium", "Easy"].map((difficulty) => (
                            <Accordion key={difficulty} type="single" collapsible>
                                <AccordionItem value={difficulty} className="border-none">
                                    <AccordionTrigger>
                                        <div className="flex gap-[2rem]">{difficulty}</div>
                                    </AccordionTrigger>
                                    {renderQuestions(difficulty)}
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default LeetCodeQuestions;
