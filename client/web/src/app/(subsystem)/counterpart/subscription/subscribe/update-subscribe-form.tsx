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
import { UpdateSubscriptionRequestDTO, UpdateSubscriptionRequestSchema, SubscriptionType } from "@/schema/event.schema";
import MapWithClick from "@/lib/leaflet/Map";

export function UpdateSubscriptionForm({
    subscription,
    back,
}: {
    subscription: SubscriptionType | null | undefined;
    back: (refetch?: boolean) => void;
}) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const updateSubscriptionForm = useForm<UpdateSubscriptionRequestDTO>({
        resolver: zodResolver(UpdateSubscriptionRequestSchema),
        defaultValues: {
            id: subscription!.id,
            name: subscription!.name,
            address: subscription!.address,
            areaId: subscription!.area!.id,
            location: subscription!.location,
            status: subscription!.status,
        },
    });
    async function onSubmit(values: UpdateSubscriptionRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            // const result = await authApiRequest.login(values);
            console.log({ ...values });
            toast({
                description: "Update subscription successfully",
                duration: 2000,
                className: "bg-green-500 text-white",
            });
            await new Promise((resolve) => setTimeout(resolve, 0));
            updateSubscriptionForm.reset();
            back(true);
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
                    name="areaId"
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
                                    <SelectItem value="1" defaultChecked={field.value === "1"}>
                                        Food
                                    </SelectItem>
                                    <SelectItem value="2" defaultChecked={field.value === "2"}>
                                        Drink
                                    </SelectItem>
                                    <SelectItem value="3" defaultChecked={field.value === "3"}>
                                        Fashion
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
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
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                        type="button"
                        onClick={() => {
                            updateSubscriptionForm.reset();
                            back();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="block bg-lime-500 hover:bg-lime-600 text-white">
                        Update
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
