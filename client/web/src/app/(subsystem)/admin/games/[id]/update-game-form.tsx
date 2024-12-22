"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { GameType, UpdateGameRequestDTO, UpdateGameRequestSchema } from "@/schema/game.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
// Foala rich text editor
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { CircleX } from "lucide-react";
import { AnimationButton } from "@/components/shared/custom-button";

const options = {
    toolbarButtons: [
        "bold",
        "italic",
        "underline",
        "alignRight",
        "alignCenter",
        "alignLeft",
        "outdent",
        "indent",
        "undo",
        "redo",
        "clearFormatting",
        "selectAll",
    ],
    pluginsEnabled: ["align", "charCounter"],
    charCounterMax: 2000,
};

export default function UpdateGameForm({ game, back }: { game: GameType; back: () => void }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [image, setImage] = useState<File | null>(null);
    const updateGameForm = useForm<UpdateGameRequestDTO>({
        resolver: zodResolver(UpdateGameRequestSchema),
        defaultValues: {
            name: game.name!,
            allowTrading: game.allowTrading!,
            type: game.type!,
            guide: game.guide!,
        },
    });
    async function onSubmit(values: UpdateGameRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            console.log({ ...values, image: image });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast({
                description: "Login successfully",
                duration: 2000,
                className: "bg-lime-500 text-white",
            });
            back();
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: updateGameForm.setError,
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Form {...updateGameForm}>
            <form onSubmit={updateGameForm.handleSubmit(onSubmit)} className="p-4" noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="image">
                        <label
                            htmlFor="uploadFile1"
                            className="text-gray-500 dark:text-white font-semibold text-base rounded max-w-md h-18 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif] py-2"
                        >
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 mb-2 fill-gray-500 dark:fill-white"
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
                                id="uploadFile1"
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
                        {image ? (
                            <div className="relative mt-2 w-96 mx-auto border rounded-sm p-1">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="your image"
                                    className="object-cover mx-auto max-h-80"
                                />
                                <button
                                    className="absolute top-1 right-1 rounded-full p-1"
                                    onClick={() => setImage(null)}
                                >
                                    <CircleX strokeWidth={3} color="red" className="hover:stroke-lime-500" />
                                </button>
                            </div>
                        ) : (
                            <img src={game.image} alt="your image" className="mt-2 w-96 mx-auto border rounded-sm" />
                        )}
                    </div>
                    <div className="info">
                        <FormField
                            control={updateGameForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-white">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter game name"
                                            type="name"
                                            {...field}
                                            className="!mt-0 border-gray-200 bg-white dark:bg-black dark:text-white "
                                        />
                                    </FormControl>
                                    {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updateGameForm.control}
                            name="allowTrading"
                            render={({ field }) => (
                                <FormItem className="flex gap-3 items-center py-4">
                                    <FormLabel className="dark:text-white">Allow Trading</FormLabel>
                                    <FormControl>
                                        {/* <Checkbox className="!mt-0" /> */}
                                        <Checkbox
                                            className="!mt-0"
                                            checked={field.value ? true : false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updateGameForm.control}
                            name="guide"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-white">Guide</FormLabel>
                                    <FormControl>
                                        <Controller
                                            name="guide"
                                            rules={{ required: true }}
                                            control={updateGameForm.control}
                                            render={({ field }) => (
                                                <FroalaEditorComponent
                                                    tag="textarea"
                                                    model={field.value}
                                                    onModelChange={field.onChange}
                                                    config={options}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="!mt-5 flex justify-center items-center gap-6 ">
                    <Button
                        className="block text-base !py-0 cancel-btn-color"
                        onClick={() => back()}
                        variant="destructive"
                    >
                        Cancel
                    </Button>
                    <AnimationButton type="submit" className="block px-3 py-[.37rem]">
                        Update {loading ? <span className="animate-spin">⌛</span> : ""}
                    </AnimationButton>
                </div>
            </form>
        </Form>
    );
}
