import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BellRing } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Notification({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-0">
            <Popover>
                <PopoverTrigger className="flex items-center">
                    <div className="relative">
                        {children}
                        <div className="absolute top-0 right-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                            </span>
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="mt-2 min-w-[23rem] p-0 border border-gray-200">
                    <p className="text-center font-semibold pt-1 border-b border-b-gray-200">Notification</p>
                    <ul className="py-1">
                        <Link
                            href="#"
                            className="flex gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 py-1 px-3 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-8 md:w-12 ">
                                <img
                                    src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                                    alt=""
                                    className="w-full h-8 md:h-12 rounded-md object-cover m-auto"
                                />
                            </div>
                            <div className="content flex-[1]">
                                <div className="flex justify-between items-center">
                                    <h1 className="line-clamp-1 text-sm">Message title</h1>
                                    <span className="text-[.75rem]">2023-01-01</span>
                                </div>
                                <p className="line-clamp-2 text-xs text-justify">Your event has been rejected!</p>
                            </div>
                        </Link>
                        <Link
                            href="#"
                            className="flex gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 py-1 px-3 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-8 md:w-12 bg-slate-50 dark:bg-slate-800 rounded-sm">
                                <BellRing className="w-12 h-8 md:h-10 rounded-md object-cover m-auto" />
                            </div>
                            <div className="content flex-[1]">
                                <div className="flex justify-between items-center">
                                    <h1 className="line-clamp-1 text-sm">Message title</h1>
                                    <span className="text-[.75rem]">2023-01-01</span>
                                </div>
                                <p className="line-clamp-2 text-xs text-justify">
                                    Message description Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
                                    officia, voluptatibus delectus quisquam tempora cum beatae provident, sapiente hic
                                    non ex nemo consectetur vero molestias rem voluptas recusandae eos ipsam.
                                </p>
                            </div>
                        </Link>
                    </ul>
                    <div className="flex justify-center p-1 border-t border-t-gray-200">
                        <Link href="/notification" className="text-sm text-sky-500 hover:text-sky-400 hover:underline">
                            View All
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
