"use client";

import ViewVoucherModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-modal";
import { defaultVoucherImage } from "@/lib/utils";
import { VoucherEventItemType } from "@/schema/event.schema";
import { Info } from "lucide-react";

export default function VoucherItem({ item }: { item: VoucherEventItemType }) {
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img src={defaultVoucherImage} alt="Voucher image" className="w-full h-full object-cover border" />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">
                    Discount <span className="dynamic-text text-lg">{item.discount}%</span>
                </p>
                <span className="text-sm">
                    Quantity: <b>{item.total}</b>
                </span>
                <span className="text-sm">
                    Remaining: <b>{item.remaining}</b>
                </span>
            </div>
            <div className="flex items-center gap-4 px-3">
                <ViewVoucherModal item={item}>
                    <Info color="blue" strokeWidth={3} className="cursor-pointer" />
                </ViewVoucherModal>
            </div>
        </div>
    );
}
