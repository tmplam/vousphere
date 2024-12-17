"use client";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/utility/mode-toggle";
import Link from "next/link";

export default function Home() {
    return (
        <div className="my-section bg-gradient-to-r from-sky-100 to-fuchsia-100 dark:from-sky-950 dark:to-fuchsia-950">
            <div className="absolute top-4 right-4">
                <DarkModeToggle />
            </div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999]">
                <div className="flex flex-col items-center justify-center  text-center">
                    <h1 className="text-5xl font-bold dynamic-text p-1">Please login to continue</h1>

                    <Button
                        type="submit"
                        className="!mt-8 block m-auto bg-gradient-to-br from-sky-400 to-fuchsia-400 transition-all duration-1000 hover:bg-gradient-to-br hover:from-sky-500 hover:to-fuchsia-500"
                    >
                        <Link href="/login" className="text-white">
                            Login
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="air air1 opacity-100 dark:opacity-30 dark:!bottom-0"></div>
            <div className="air air2 opacity-40 dark:opacity-20 dark:!bottom-0"></div>
            <div className="air air3 opacity-20 dark:opacity-10 dark:!bottom-0"></div>
            <div className="air air4 opacity-65 dark:opacity-30 dark:!bottom-0"></div>
            <div className="snowflakes" aria-hidden="true">
                <div className="snowflake !text-violet-400">❅</div>
                <div className="snowflake !text-purple-400">❅</div>
                <div className="snowflake !text-fuchsia-400">❆</div>
                <div className="snowflake !text-pink-400">❄</div>
                <div className="snowflake !text-rose-400">❅</div>
                <div className="snowflake !text-lime-400">❆</div>
                <div className="snowflake !text-sky-400">❄</div>
                <div className="snowflake !text-cyan-400">❅</div>
                <div className="snowflake !text-teal-400">❆</div>
                <div className="snowflake !text-yellow-400">❄</div>
            </div>
        </div>
    );
}
