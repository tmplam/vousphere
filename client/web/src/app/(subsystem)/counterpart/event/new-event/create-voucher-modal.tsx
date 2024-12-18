"use client";
import { VoucherAmount } from "@/app/(subsystem)/counterpart/event/new-event/page";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
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
import { CreateVoucherRequestDTO, CreateVoucherRequestSchema } from "@/schema/event.schema";
import { useState } from "react";
import { CircleX } from "lucide-react";
import { AnimationButton } from "@/components/shared/custom-button";

export default function CreateVoucherModal({
    children,
    onAddingVouchers,
    open,
    setOpen,
}: {
    children: React.ReactNode;
    onAddingVouchers: (voucherAmount: VoucherAmount) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[80vw] xl:max-w-[60vw] max-h-[88vh] border border-gray-300 overflow-y-auto py-4 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">ADD VOUCHER</DialogTitle>
                </DialogHeader>
                <div className="h-full w-full">
                    <VoucherAmountForm onAddingVouchers={onAddingVouchers} setOpen={setOpen} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function VoucherAmountForm({
    onAddingVouchers,
    setOpen,
}: {
    onAddingVouchers: (voucherAmount: VoucherAmount) => void;
    setOpen: (open: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [image, setImage] = useState<File | null>(null);
    const createVoucherForm = useForm<CreateVoucherRequestDTO>({
        resolver: zodResolver(
            CreateVoucherRequestSchema.and(
                z.object({
                    amount: z.coerce
                        .number({ required_error: "The amount of vouchers is required" })
                        .min(1, { message: "The amount of vouchers must be at least 1" }),
                })
            )
        ),
        defaultValues: {
            value: 1,
            description: "demo demo demo",
            expiryDate: "2024-12-27T20:00",
            amount: 1,
            image: "null",
        },
    });
    async function onSubmit(values: CreateVoucherRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            console.log({ ...values, image: image });
            toast({
                description: "Add voucher successfully",
                duration: 2000,
                className: "bg-lime-500 text-white",
            });
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            const { amount: voucherAmount, ...voucherValue } = values;
            voucherValue.image = image;
            onAddingVouchers({ amount: voucherAmount, voucher: voucherValue });
            createVoucherForm.reset();
            setImage(null);
            setOpen(false);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: createVoucherForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...createVoucherForm}>
            <form onSubmit={createVoucherForm.handleSubmit(onSubmit)} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="image">
                        <FormLabel>Voucher image</FormLabel>
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
                            <input
                                type="file"
                                id="uploadVoucherFile"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    setImage(e.target.files ? e.target.files[0] : null);
                                }}
                                value=""
                            />
                            <p className="text-xs text-center font-medium text-gray-400">
                                Only PNG, JPG and JPEG are allowed.
                            </p>
                        </label>
                        {image && (
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
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex flex-wrap lg:justify-between gap-x-10  gap-y-2">
                            <FormField
                                control={createVoucherForm.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount value</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-1 !m-0">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    {...field}
                                                    className="!mt-0  border-gray-300"
                                                />
                                                <span>(%)</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createVoucherForm.control}
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
                            />
                        </div>
                        <FormField
                            control={createVoucherForm.control}
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
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createVoucherForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total vouchers:</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter voucher amount"
                                            type="number"
                                            min={1}
                                            {...field}
                                            className="!mt-0 border-gray-300 w-auto"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={createVoucherForm.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <FormControl>
                                            <SelectTrigger className="w-full !mt-0">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Admin</SelectItem>
                                            <SelectItem value="2">Counterpart</SelectItem>
                                            <SelectItem value="3">Player</SelectItem>
                                        </SelectContent>
                                    </Select> 
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>
                </div>
                <div className="!mt-5 flex !justify-center items-center gap-6">
                    <DialogClose asChild>
                        <Button className="block text-base cancel-btn-color !py-0">Close</Button>
                    </DialogClose>
                    <AnimationButton type="submit" className="block py-[.37rem] px-4">
                        Add
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
