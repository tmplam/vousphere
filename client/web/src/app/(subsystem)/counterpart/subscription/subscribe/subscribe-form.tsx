"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionRequestDTO, SubscriptionRequestSchema } from "@/schema/event.schema";
import MapWithClick from "@/lib/leaflet/Map";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimationButton } from "@/components/shared/custom-button";
import { callCreateSubscriptionRequest } from "@/apis/event-api";
import { MySubscriptionSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import { useCachedUserInfo } from "@/lib/react-query/userCache";

export function SubscriptionForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const createSubscriptionForm = useForm<SubscriptionRequestDTO>({
        resolver: zodResolver(SubscriptionRequestSchema),
        defaultValues: {
            name: "",
            address: "",
            phoneNumber: "",
            domain: "food",
        },
    });
    const { data: userAuth, isLoading, isFetching, refetch } = useCachedUserInfo();
    if (isLoading || isFetching) return <MySubscriptionSkeleton />;
    if (userAuth?.brand && userAuth!.brand.address != "" && userAuth!.brand.domain != "") {
        return (
            <>
                <div className="p-3 shadow-md border border-gray-100 rounded-md dark:bg-slate-800 bg-white w-full">
                    <div className="flex items-center justify-center gap-3 min-h-[20rem] flex-col w-full">
                        <p className="text-center px-6">You already have a subscription!</p>
                        <AnimationButton className="py-[.37rem] px-3">
                            <Link href="/counterpart/subscription" className="text-white">
                                My subscription
                            </Link>
                        </AnimationButton>
                    </div>
                </div>
            </>
        );
    }

    async function onSubmit(values: SubscriptionRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callCreateSubscriptionRequest(values);
            if (result.status == 204) {
                toast({
                    description: "Subscribe successfully",
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                createSubscriptionForm.reset();
                router.push("/counterpart/subscription?rf=true");
            } else {
                toast({
                    description: "Failed to subscribe. Please try again",
                    variant: "destructive",
                    duration: 3000,
                    className: "bg-red-500 text-white",
                });
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: createSubscriptionForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...createSubscriptionForm}>
            <form
                onSubmit={createSubscriptionForm.handleSubmit(onSubmit)}
                className="w-full space-y-3 border rounded-md p-3 bg-white dark:bg-gray-950 border-gray-100"
                noValidate
            >
                <FormField
                    control={createSubscriptionForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter name" {...field} className="!mt-0 border-gray-200" />
                            </FormControl>
                            {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={createSubscriptionForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter phone number" {...field} className="!mt-0 border-gray-200" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={createSubscriptionForm.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the address"
                                    type="email"
                                    {...field}
                                    className="!mt-0 border-gray-200"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={createSubscriptionForm.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Area</FormLabel>
                            <Select onValueChange={field.onChange} {...field}>
                                <FormControl>
                                    <SelectTrigger className="w-full !mt-0 border-gray-200">
                                        <SelectValue placeholder="Select an area" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="z-50 border-gray-200">
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="drink">Drink</SelectItem>
                                    <SelectItem value="fashion">Fashion</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={createSubscriptionForm.control}
                    name="location"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <div className="w-full md:w-[40rem] lg:w-[50rem] xl:w-[60rem] mx-auto h-[20rem] md:h-[30rem]">
                                    <MapWithClick onChange={field.onChange} />
                                </div>
                            </FormControl>
                            <FormMessage>{fieldState.error && fieldState.error.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <div className="!mt-6 flex justify-center items-center gap-5 ">
                    <Button className="text-base cancel-btn-color">
                        <Link href="/counterpart/subscription" className="text-white">
                            Cancel
                        </Link>
                    </Button>
                    <AnimationButton type="submit" className="block px-3 py-[.37rem]">
                        Create
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
