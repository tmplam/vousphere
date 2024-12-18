"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { CreateUserRequestSchema, CreateUserRequestDTO } from "@/schema/user.schema";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimationButton } from "@/components/shared/custom-button";

export function CreateUserForm() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const { toast } = useToast();
    const createUserForm = useForm<CreateUserRequestDTO>({
        resolver: zodResolver(CreateUserRequestSchema),
        defaultValues: {
            name: "Alysa Kojou",
            phone: "1234567890",
            email: "admin@gmail.com",
            password: "adminpass",
        },
    });
    async function onSubmit(values: CreateUserRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log({ ...values, image: image });
            toast({
                description: "Login successfully",
                duration: 2000,
                className: "bg-lime-500 text-white",
            });
            createUserForm.reset();
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: createUserForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...createUserForm}>
            <form onSubmit={createUserForm.handleSubmit(onSubmit)} className="p-2 md:p-4" noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="image">
                        <label
                            htmlFor="uploadAvatarFile"
                            className=" text-gray-700 dark:text-gray-300 font-semibold text-base rounded max-w-md h-20 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                        >
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-9 fill-gray-700 dark:fill-gray-300"
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
                                id="uploadAvatarFile"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    setImage(e.target.files ? e.target.files[0] : null);
                                }}
                                value=""
                            />
                            <p className="text-xs font-medium text-gray-400">
                                PNG, JPG SVG, WEBP, and GIF are Allowed.
                            </p>
                        </label>
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="your image"
                                className="mt-2 max-w-96 max-h-72 mx-auto object-cover border border-gray-200 rounded-sm"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={createUserForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
                                            {...field}
                                            className="!mt-0 border-gray-200"
                                        />
                                    </FormControl>
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createUserForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                            className="!mt-0 border-gray-200"
                                        />
                                    </FormControl>
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createUserForm.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your phone number"
                                            {...field}
                                            className="!mt-0 border-gray-200"
                                        />
                                    </FormControl>
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createUserForm.control}
                            name="roleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} {...field}>
                                        <FormControl>
                                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Admin</SelectItem>
                                            <SelectItem value="2">Counterpart</SelectItem>
                                            <SelectItem value="3">Player</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createUserForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Enter your password"
                                            className="mt-0 border-gray-200"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            defaultValue="123456"
                        />
                    </div>
                </div>
                <div className="!mt-5 flex justify-center items-center gap-6">
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="block text-base font-normal !py-0 cancel-btn-color">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                    <AnimationButton type="submit" className="block py-[.37rem] px-3">
                        Create
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
