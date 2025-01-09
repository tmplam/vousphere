"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { callUploadImage } from "@/apis/media-api";
import { callUpdateGameRequest } from "@/apis/game-api";
import { SelectGroup } from "@/components/ui/select";

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

export default function UpdateGameForm({ game, back }: { game: GameType; back: (refetchData: boolean) => void }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [image, setImage] = useState<File | null>(null);
    const [imageId, setImageId] = useState<string | null>(null);
    const updateGameForm = useForm<UpdateGameRequestDTO>({
        resolver: zodResolver(UpdateGameRequestSchema),
        defaultValues: {
            name: game.name!,
            imageId: game.imageId!,
            // allowTrading: game.allowTrading!,
            // type: game.type!,
            description: game.description!,
        },
    });

    async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const result = await callUploadImage(file);
            if (result?.isSuccess && result.statusCode == 200) {
                setImageId(result.data.imageId);
                setImage(file);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to upload image. Please try again",
                    variant: "destructive",
                    duration: 2000,
                });
            }
        } else {
            setImage(null);
            setImageId(null);
            toast({
                title: "Error",
                description: "Upload image from local failed",
                variant: "destructive",
                duration: 2000,
            });
        }
    }

    async function onSubmit(values: UpdateGameRequestDTO) {
        if (loading) return;
        setLoading(true);
        try {
            const payload = {
                ...values,
            };
            if (imageId) {
                payload.imageId = imageId;
            }
            const result = await callUpdateGameRequest(game.id, payload);
            if (result.status == 204) {
                toast({
                    description: "Update game successfully",
                    duration: 3000,
                    className: "bg-lime-500 text-white",
                });
                back(true);
            } else {
                toast({
                    description: "Unexpected error. Please try again",
                    duration: 2000,
                    className: "bg-lime-500 text-white",
                });
            }
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
                        <FormLabel className="dark:text-white">Game image</FormLabel>
                        <label
                            htmlFor="uploadGameImageFile"
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
                                id="uploadGameImageFile"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUploadFile}
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
                                    fetchPriority="high"
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
                            <>
                                {game.image ? (
                                    <img
                                        src={game.image}
                                        alt="your image"
                                        fetchPriority="high"
                                        className="mt-2 w-96 mx-auto border rounded-sm"
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3 items-center py-4">
                            <FormLabel className="dark:text-white">Game type: </FormLabel>
                            <select
                                id="gameType"
                                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-1 dark:bg-black dark:placeholder-gray-400 dark:text-white"
                                disabled
                                defaultValue={game.type}
                            >
                                <option value={game.type}>{game.type}</option>
                            </select>
                        </div>
                        <FormField
                            control={updateGameForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="dark:text-white">Guide</FormLabel>
                                    <FormControl>
                                        <Controller
                                            name="description"
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
                        onClick={() => back(false)}
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
