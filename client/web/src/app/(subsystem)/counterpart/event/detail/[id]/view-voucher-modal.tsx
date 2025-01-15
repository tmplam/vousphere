"use client";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { defaultVoucherImage, printDateTime } from "@/lib/utils";
import { VoucherEventItemType, VoucherEventType } from "@/schema/event.schema";

export default function ViewVoucherModal({
    children,
    item,
}: {
    children: React.ReactNode;
    item: VoucherEventItemType;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">VOUCHER INFO</DialogTitle>
                </DialogHeader>
                <div className="mt-0">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="image">
                            <img
                                src={defaultVoucherImage}
                                alt="your image"
                                className="mt-2 w-full max-h-56 mx-auto object-cover rounded-md"
                            />
                        </div>
                        <div className="px-4 sm:px-8">
                            <div className="flex flex-col w-full space-y-2">
                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Discount:</b>
                                    <span className="dynamic-text text-2xl text-white font-bold">
                                        {item.discount!} %
                                    </span>
                                </div>
                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Total voucher:</b>
                                    <span>{item.total}</span>
                                </div>
                                <div className="text-md sm:text-xl lg:text-xl font-thin">
                                    <b className="font-semibold w-[9rem] inline-block">Remaining:</b>
                                    {item.remaining > 0 ? (
                                        <Badge className="bg-lime-500 text-white -translate-y-1">
                                            {item.remaining}
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-rose-500 text-white -translate-y-1">
                                            {item.remaining}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
