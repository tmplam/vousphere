"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { UpdateVoucherRequestDTO, UpdateVoucherRequestSchema, VoucherAmount } from "@/schema/event.schema";
import { useState } from "react";
import { CircleX } from "lucide-react";
import { AnimationButton } from "@/components/shared/custom-button";

export default function UpdateVoucherModal({
    children,
    index,
    item,
    onUpdateVouchers,
    open,
    setOpen,
}: {
    children: React.ReactNode;
    item: VoucherAmount;
    index: number;
    onUpdateVouchers: (voucherAmount: VoucherAmount, index: number) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[80vw] sm:max-w-[60vw] lg:max-w-[40vw] max-h-[88vh] border border-gray-300 overflow-y-auto py-4 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-gradient">UPDATE VOUCHER</DialogTitle>
                </DialogHeader>
                <div className="h-full w-full">
                    <VoucherAmountForm
                        index={index}
                        item={item}
                        onUpdateVouchers={onUpdateVouchers}
                        setOpen={setOpen}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function VoucherAmountForm({
    item,
    index,
    onUpdateVouchers,
    setOpen,
}: {
    item: VoucherAmount;
    index: number;
    onUpdateVouchers: (voucherAmount: VoucherAmount, index: number) => void;
    setOpen: (open: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    // const [image, setImage] = useState<File | null>(item.voucher.image);
    const updateVoucherForm = useForm<UpdateVoucherRequestDTO>({
        resolver: zodResolver(UpdateVoucherRequestSchema),
        defaultValues: {
            discount: item.discount!,
            total: item.total!,
            // description: item.voucher.description!,
            // expiryDate: item.voucher.expiryDate!,
            // image: "",
        },
    });
    async function onSubmit(values: UpdateVoucherRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            toast({
                description: "Update voucher successfully",
                duration: 2000,
                className: "bg-lime-500 text-white",
            });
            // const { amount: voucherAmount, ...voucherValue } = values;
            // voucherValue.image = image;
            // const updatedVocherAmount = { amount: voucherAmount, voucher: voucherValue };
            // console.log(updatedVocherAmount);
            onUpdateVouchers({ ...values }, index);
            setOpen(false);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: updateVoucherForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }

    const triggerUpdateVoucherSubmitForm = () => {
        updateVoucherForm.handleSubmit(onSubmit)();
    };

    return (
        <Form {...updateVoucherForm}>
            <form onSubmit={updateVoucherForm.handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-1 gap-4">
                    <div className="image hidden">
                        <label
                            htmlFor="uploadVoucherFile"
                            className=" text-gray-700 dark:text-gray-300 font-semibold text-base rounded max-w-md h-18 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] py-1"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 fill-gray-700 dark:fill-gray-300"
                                    viewBox="0 0 32 32"
                                >
                                    <path
                                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                        data-original="#000000"
                                    />
                                    <path
                                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                        data-original="#000000"
                                    />
                                </svg>
                                Upload file
                            </div>
                            {/* <input
                                type="file"
                                id="uploadVoucherFile"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    setImage(e.target.files ? e.target.files[0] : null);
                                }}
                                value=""
                            /> */}
                            <p className="text-xs text-center font-medium text-gray-400">
                                Only PNG, JPG and JPEG are allowed.
                            </p>
                        </label>
                        {/* {image && (
                            <div className="relative mt-2 w-[360px] mx-auto border rounded-sm p-1">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="your image"
                                    className="mt-2 w-full max-h-56 mx-auto object-cover"
                                />
                                <button
                                    className="absolute top-1 right-1 rounded-full p-1"
                                    onClick={() => setImage(null)}
                                >
                                    <CircleX strokeWidth={3} color="red" className="hover:stroke-lime-500" />
                                </button>
                            </div>
                        )} */}
                    </div>
                    <div className="space-y-2">
                        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
                            <FormField
                                control={updateVoucherForm.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount value</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-1 !m-0">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="!mt-0  border-gray-300"
                                                />
                                                <span>(%)</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={updateVoucherForm.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                {...field}
                                                value={field.value}
                                                className="!mt-0 w-auto border-gray-300"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* <FormField
                            control={updateVoucherForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Voucher description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={4}
                                            placeholder="Enter description for your voucher"
                                            {...field}
                                            className="!mt-0 border-gray-300"
                                        />
                                    </FormControl> 
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                            <FormField
                                control={updateVoucherForm.control}
                                name="total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total vouchers:</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter total voucher"
                                                type="number"
                                                min={1}
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="!mt-0 border-gray-300 w-auto"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="!mt-5 flex !justify-center items-center gap-2 md:gap-5">
                    <DialogClose asChild>
                        <Button type="button" className="text-md cancel-btn-color">
                            Close
                        </Button>
                    </DialogClose>
                    <AnimationButton
                        type="button"
                        className="block px-3 py-[.37rem]"
                        onClick={triggerUpdateVoucherSubmitForm}
                    >
                        Update
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
