"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    UpdateSubscriptionRequestDTO,
    UpdateSubscriptionRequestSchema,
    SubscriptionType,
    SubscriptionEventType,
} from "@/schema/event.schema";
import MapWithClick from "@/lib/leaflet/Map";
import { AnimationButton } from "@/components/shared/custom-button";
import { UserType } from "@/schema/user.schema";
import { callUpdateSubscriptionRequest } from "@/apis/event-api";
import { useRouter } from "next/navigation";

export function UpdateSubscriptionForm({ subscription, back }: { subscription: UserType; back: () => void }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const updateSubscriptionForm = useForm<UpdateSubscriptionRequestDTO>({
        resolver: zodResolver(UpdateSubscriptionRequestSchema),
        defaultValues: {
            id: subscription!.id,
            name: subscription!.name,
            address: subscription!.brand.address,
            domain: subscription!.brand.domain,
            location: [subscription!.brand.latitude, subscription!.brand.longitude],
            phoneNumber: subscription!.phoneNumber,
        },
    });
    async function onSubmit(values: UpdateSubscriptionRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const result = await callUpdateSubscriptionRequest(values);
            if (result.status == 204) {
                toast({
                    description: "Update subscription successfully",
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
                updateSubscriptionForm.reset();
                window.location.reload();
            } else {
                toast({
                    description: "Failed to update subscription. Please try again",
                    variant: "destructive",
                    duration: 3000,
                    className: "bg-red-500 text-white",
                });
            }
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: updateSubscriptionForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...updateSubscriptionForm}>
            <form
                onSubmit={updateSubscriptionForm.handleSubmit(onSubmit)}
                className="w-full space-y-3 border rounded-md p-3 bg-white dark:bg-gray-950 border-gray-100"
                noValidate
            >
                <FormField
                    control={updateSubscriptionForm.control}
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
                    control={updateSubscriptionForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter phone number" {...field} className="!mt-0 border-gray-200" />
                            </FormControl>
                            {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateSubscriptionForm.control}
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
                            {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateSubscriptionForm.control}
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
                                    <SelectItem value="food" defaultChecked={field.value === "1"}>
                                        Food
                                    </SelectItem>
                                    <SelectItem value="drink" defaultChecked={field.value === "2"}>
                                        Drink
                                    </SelectItem>
                                    <SelectItem value="fashion" defaultChecked={field.value === "3"}>
                                        Fashion
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateSubscriptionForm.control}
                    name="location"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <div className="w-full md:w-[40rem] lg:w-[50rem] xl:w-[60rem] mx-auto h-[20rem] md:h-[30rem]">
                                    <MapWithClick location={field.value} onChange={field.onChange} />
                                </div>
                            </FormControl>
                            <FormMessage>{fieldState.error && fieldState.error.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <div className="!mt-6 flex justify-center items-center gap-5 ">
                    <Button
                        className="cancel-btn-color text-base"
                        type="button"
                        onClick={() => {
                            updateSubscriptionForm.reset();
                            back();
                        }}
                    >
                        Cancel
                    </Button>
                    <AnimationButton type="submit" className="block px-3 py-[.37rem]">
                        Update
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
