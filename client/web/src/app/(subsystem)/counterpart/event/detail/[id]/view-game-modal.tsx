"use client";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { defaultGameImage } from "@/lib/utils";
import { GameType } from "@/schema/game.schema";

export default function ViewGameModal({ children, item }: { children: React.ReactNode; item: GameType }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-gradient">GAME INFO</DialogTitle>
                </DialogHeader>
                <div className="mt-0">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="image">
                            <img
                                src={item.image || defaultGameImage}
                                alt="your image"
                                className="mt-2 w-full max-h-56 mx-auto object-cover rounded-md"
                            />
                        </div>
                        <div className="px-4 sm:px-8">
                            <div className="flex flex-col w-full space-y-2">
                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Name:</b>
                                    <span className="dynamic-text text-2xl text-white font-bold">{item.name}</span>
                                </div>
                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Guide:</b>
                                    <span
                                        className="text-[1.1rem]"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    ></span>
                                </div>

                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Game type:</b>
                                    <span className={`${getBadge()} -translate-y-1`}>{item.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
