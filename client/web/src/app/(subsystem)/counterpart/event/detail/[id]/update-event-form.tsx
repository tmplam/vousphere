"use client";

import { callUpdateEventRequest } from "@/apis/event-api";
import { getAllGamesAndQuizzes } from "@/apis/game-api";
import { callUploadImage } from "@/apis/media-api";
import ViewVoucherModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-voucher-modal";
import CreateVoucherModal from "@/app/(subsystem)/counterpart/event/new-event/create-voucher-modal";
import ImageGrid from "@/app/(subsystem)/counterpart/event/new-event/image-grid";
import { GameQuizType } from "@/app/(subsystem)/counterpart/event/new-event/page";
import SelectGameModal from "@/app/(subsystem)/counterpart/event/new-event/select-game";
import UpdateVoucherModal from "@/app/(subsystem)/counterpart/event/new-event/update-voucher-modal";
import { AnimationButton } from "@/components/shared/custom-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    addTime,
    convertToVietnamTimezone,
    defaultEventImage,
    defaultGameImage,
    defaultVoucherImage,
} from "@/lib/utils";
import { EventGameType, VoucherAmount, VoucherEventItemType, VoucherEventType } from "@/schema/event.schema";
import { GameAndQuizListType, GameType } from "@/schema/game.schema";
import { CircleX, Info, Plus, Trash, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateEventForm = ({ event, back }: { event: EventGameType; back: (refetchData?: boolean) => void }) => {
    const [name, setName] = useState(event.name);
    const [errorName, setErrorName] = useState("");
    const [description, setDescription] = useState(event.description);
    const [errorDescription, setErrorDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [errorImage, setErrorImage] = useState("");
    const [imageItem, setImageItem] = useState<File | null>(null);
    const [errorImageItem, setErrorImageItem] = useState("");
    const [vouchers, setVouchers] = useState<VoucherAmount[]>(
        event.voucherTypes.map((v) => {
            return {
                discount: v.discount,
                total: v.total,
            };
        })
    );
    const [totalItem, setTotalItem] = useState<string>(event.item?.numberPieces.toString() || "4");
    const [errorVouchers, setErrorVouchers] = useState("");
    const [startTime, setStartTime] = useState(convertToVietnamTimezone(event.startTime, 7));
    const [errorStartTime, setErrorStartTime] = useState("");
    const [endTime, setEndTime] = useState(convertToVietnamTimezone(event.endTime, 7));
    const quizGameItem = event.games.find((g) => g.quizzCollectionId);
    const currentStartTimeQuiz = quizGameItem
        ? convertToVietnamTimezone(quizGameItem.startTime, 7)
        : addTime(new Date(), 10).toJSON();
    const [startTimeQuiz, setStartTimeQuiz] = useState<string>(currentStartTimeQuiz);
    const [errorEndTime, setErrorEndTime] = useState("");
    const [gamesAndQuizzes, setGamesAndQuizzes] = useState<GameQuizType[]>([]);
    const [errorGames, setErrorGames] = useState("");
    const [gameAndQuizList, setGameAndQuizList] = useState<GameAndQuizListType | null>(null);

    const [loading, setLoading] = useState(false);
    const [imageId, setImageId] = useState<string | null>(null);
    const [imageItemId, setImageItemId] = useState<string | null>(null);

    const [openCreateVoucherModal, setOpenCreateVoucherModal] = useState(false);
    const { toast } = useToast();
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const getGamesAndQuizzes = async () => {
            const result = await getAllGamesAndQuizzes();
            setGameAndQuizList(result);
            const savedGamesAndQuizzes = event.games.map((gameQuiz) => {
                // console.log(gameQuiz);
                const game = result?.games?.find((g) => g.id === gameQuiz.gameId)!;
                const quiz = result?.quizzes?.find((q) => q.id === gameQuiz.quizzCollectionId) || null;
                let startTimeQ = gameQuiz.startTime
                    ? convertToVietnamTimezone(gameQuiz.startTime, 7)
                    : addTime(new Date(), 10).toJSON();
                return { game, quiz, startTime: startTimeQ, popUpItemsEnabled: gameQuiz.popUpItemsEnabled };
            });
            setGamesAndQuizzes(savedGamesAndQuizzes);
            setHasFetched(true);
        };
        getGamesAndQuizzes();
    }, []);

    const validateName = () => {
        if (!name.match(/\w+\s\w+/)) {
            setErrorName("Name is too short");
            return false;
        }
        setErrorName("");
        return true;
    };

    const validateDescription = () => {
        if (!name.match(/\w+\s\w+/)) {
            setErrorDescription("Name is too short");
            return false;
        }
        setErrorDescription("");
        return true;
    };

    const validateImage = () => {
        if (!imageId) {
            setErrorImage("Image is required");
            return false;
        }
        setErrorImage("");
        return true;
    };

    const validateImageItem = () => {
        const isAllowTrading: boolean = gamesAndQuizzes.some((eachItem) => eachItem.popUpItemsEnabled);
        if (!imageItemId && !event.item && isAllowTrading) {
            setErrorImageItem("Image for item collection is required");
            return false;
        }
        setErrorImageItem("");
        return true;
    };

    const validateVouchers = () => {
        if (!vouchers || vouchers.length === 0) {
            setErrorVouchers("You still not specify any voucher yet");
            return false;
        }
        setErrorVouchers("");
        return true;
    };

    const validateGames = () => {
        if (!gamesAndQuizzes || gamesAndQuizzes.length === 0) {
            setErrorGames("You still not specify any game yet");
            return false;
        }
        for (let i = 0; i < gamesAndQuizzes.length; i++) {
            if (gamesAndQuizzes[i].quiz) {
                if (startTime > startTimeQuiz) {
                    setErrorGames("Start time of quiz must be after the start time of event");
                    return false;
                }
            }
        }
        setErrorGames("");
        return true;
    };

    const validateStartTime = () => {
        if (!startTime) {
            setErrorStartTime("Start time is required");
            return false;
        }
        setErrorStartTime("");
        return true;
    };
    const validateEndTime = () => {
        if (!endTime) {
            setErrorEndTime("End time is required");
            return false;
        } else if (endTime < startTime) {
            setErrorEndTime("End time must be after the start time");
            return false;
        }

        setErrorEndTime("");
        return true;
    };

    const isValidate = () => {
        let result = true;
        // result &&= validateImage();
        result &&= validateImageItem();
        result &&= validateName();
        result &&= validateDescription();
        result &&= validateStartTime();
        result &&= validateEndTime();
        result &&= validateVouchers();
        result &&= validateGames();
        return result;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isValidate()) return;
        // Handle form submission
        const collectItem: { imageId: string; numberPieces: string } | null = gamesAndQuizzes.some(
            (eachItem) => eachItem.popUpItemsEnabled
        )
            ? imageItem
                ? { imageId: imageItemId!, numberPieces: totalItem }
                : event.item
                ? { imageId: event.item!.imageId, numberPieces: event.item!.numberPieces.toString() }
                : null
            : null;
        const eventData = {
            name,
            description,
            imageId: imageId ? imageId : event.imageId,
            startTime: new Date(startTime).toJSON(),
            endTime: new Date(endTime).toJSON(),
            voucherTypes: vouchers,
            games: gamesAndQuizzes.map((eachGame) => {
                return {
                    gameId: eachGame.game!.id,
                    popUpItemsEnabled: eachGame.popUpItemsEnabled,
                    startTime: new Date(startTimeQuiz).toJSON(),
                    quizzCollectionId: eachGame.quiz?.id || null,
                };
            }),
            item: collectItem,
        };
        const result = await callUpdateEventRequest(event.id, eventData);
        if (result.status == 204) {
            toast({
                description: "Add event successfully",
                duration: 2000,
                className: "bg-lime-500 text-white",
            });
            back(true);
        } else {
            toast({
                description: "Add event failed",
                duration: 2000,
                className: "bg-red-500 text-white",
            });
        }
    };

    const addVouchers = (newVoucherAmount: VoucherAmount) => {
        const idxVoucherDiscount = vouchers.findIndex(
            (eachVoucher) => eachVoucher.discount === newVoucherAmount.discount
        );
        if (idxVoucherDiscount !== -1) {
            const vouchersClone = [...vouchers];
            vouchersClone[idxVoucherDiscount].total += newVoucherAmount.total;
            setVouchers(vouchersClone);
            return;
        }
        setVouchers([...vouchers, newVoucherAmount]);
    };

    const updateVouchers = (newVoucherAmount: VoucherAmount, index: number) => {
        let indexes = [];
        for (let i = 0; i < vouchers.length; i++) {
            if (vouchers[i].discount === newVoucherAmount.discount) {
                indexes.push(i);
            }
        }
        indexes = indexes.filter((eachIndex) => eachIndex !== index);
        if (indexes.length > 0) return;
        const newVouchers = [...vouchers];
        newVouchers.splice(index, 1, newVoucherAmount);
        setVouchers(newVouchers);
    };

    const removeVoucher = (index: number) => {
        const newVouchers = [...vouchers];
        newVouchers.splice(index, 1);
        setVouchers(newVouchers);
    };

    const addGamesAndQuizzes = (newGamesAndQuizzes: GameQuizType[]) => {
        const idx = newGamesAndQuizzes.findIndex((eg) => eg.quiz);
        if (idx !== -1) {
            newGamesAndQuizzes[idx].startTime = startTimeQuiz;
        }
        setGamesAndQuizzes([...newGamesAndQuizzes]);
        if (errorGames) setErrorGames("");
    };

    const removeGameAndQuiz = (index: number) => {
        const newGameQuizList = [...gamesAndQuizzes];
        newGameQuizList.splice(index, 1);
        setGamesAndQuizzes(newGameQuizList);
        if (errorGames) setErrorGames("");
    };

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

    async function handleUploadFileItem(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const result = await callUploadImage(file);
            if (result?.isSuccess && result.statusCode == 200) {
                setImageItemId(result.data.imageId);
                setImageItem(file);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to upload image. Please try again",
                    variant: "destructive",
                    duration: 2000,
                });
            }
        } else {
            setImageItem(null);
            setImageItemId(null);
            toast({
                title: "Error",
                description: "Upload image from local failed",
                variant: "destructive",
                duration: 2000,
            });
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="mx-auto p-6 rounded-lg shadow-md border border-gray-300 bg-white dark:bg-slate-900"
                noValidate
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="image">
                        <h4 className="block text-sm font-medium mb-2">Event image</h4>
                        <label
                            htmlFor="uploadEventFile"
                            className=" text-gray-700 dark:text-gray-300 font-semibold text-base rounded max-w-md h-20 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 fill-gray-700 dark:fill-gray-300"
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
                            <input
                                type="file"
                                id="uploadEventFile"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUploadFile}
                            />
                            <p className="text-xs font-medium text-gray-400">
                                PNG, JPG SVG, WEBP, and GIF are Allowed.
                            </p>
                        </label>
                        {image ? (
                            <div className="relative mt-2 w-80 mx-auto border rounded-sm p-1">
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
                            <img
                                src={event.image}
                                alt="your image"
                                className="mt-2 max-w-80 xl:max-w-96 max-h-80 object-cover mx-auto border rounded-md"
                            />
                        )}
                        {errorImage && !image && <p className="text-red-500 text-sm">{errorImage}</p>}

                        {gamesAndQuizzes.some((eachItem) => eachItem.popUpItemsEnabled) && (
                            <div className="collection-item mt-5">
                                <label className="block text-sm font-medium">Event item collection </label>
                                <label
                                    htmlFor="uploadEventItemFile"
                                    className=" text-gray-700 dark:text-gray-300 font-semibold text-base rounded max-w-md h-20 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 fill-gray-700 dark:fill-gray-300"
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
                                    <input
                                        type="file"
                                        id="uploadEventItemFile"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUploadFileItem}
                                    />
                                    <p className="text-xs font-medium text-gray-400">
                                        PNG, JPG SVG, WEBP, and GIF are Allowed.
                                    </p>
                                </label>
                                {imageItem ? (
                                    <div className="relative mt-2 w-80 mx-auto border rounded-sm p-1">
                                        <ImageGrid
                                            imageUrl={URL.createObjectURL(imageItem)}
                                            items={parseInt(totalItem)}
                                        />
                                        <button
                                            className="absolute top-1 right-1 rounded-full p-1"
                                            onClick={() => setImageItem(null)}
                                        >
                                            <CircleX strokeWidth={3} color="red" className="hover:stroke-lime-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {event.item && (
                                            <ImageGrid
                                                imageUrl={event.item.image || defaultEventImage}
                                                items={parseInt(totalItem)}
                                            />
                                        )}
                                    </>
                                )}
                                {errorImageItem && !imageItem && (
                                    <p className="text-red-500 text-sm">{errorImageItem}</p>
                                )}
                                {(imageItem || event.item) && (
                                    <div className="flex items-center gap-3 mt-2 w-[70%] mx-auto">
                                        <label className="block text-sm font-medium">Total item: </label>
                                        <Select
                                            name="totalItem"
                                            value={totalItem}
                                            onValueChange={(value) => {
                                                setTotalItem(value);
                                            }}
                                            defaultValue={event.item?.numberPieces.toString() || "4"}
                                        >
                                            <SelectTrigger className="w-[8rem] border border-gray-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="4">4 items</SelectItem>
                                                    <SelectItem value="9">9 items</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="info space-y-3">
                        <div className="">
                            <label className="block text-sm font-medium">Event name</label>
                            <Input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrorName("");
                                }}
                                className="w-full border p-2 rounded-md bg-white dark:bg-black border-gray-300"
                            />
                            {errorName && <p className="text-red-500 text-sm">{errorName}</p>}
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium">Event description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setErrorDescription("");
                                }}
                                rows={3}
                                className="w-full border p-2 rounded-md bg-white dark:bg-black border-gray-300"
                            />
                            {errorDescription && <p className="text-red-500 text-sm">{errorDescription}</p>}
                        </div>
                        <div className="flex justify-between flex-wrap gap-3">
                            <div className="">
                                <label className="block text-sm font-medium w-full">Start time</label>
                                <Input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => {
                                        setStartTime(e.target.value);
                                        setErrorStartTime("");
                                    }}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded-md bg-white dark:bg-black"
                                />
                                {errorStartTime && <p className="text-red-500 text-sm">{errorStartTime}</p>}
                            </div>
                            <div className="">
                                <label className="block text-sm font-medium ">End time</label>
                                <Input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => {
                                        setEndTime(e.target.value);
                                        setErrorEndTime("");
                                    }}
                                    required
                                    className="w-full border p-2 rounded-md bg-white dark:bg-black border-gray-300"
                                />
                                {errorEndTime && <p className="text-red-500 text-sm">{errorEndTime}</p>}
                            </div>
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium">Vouchers</label>
                            <div className="flex flex-col gap-1 mt-1">
                                {vouchers.map((voucher, index) => (
                                    <VoucherItem
                                        item={voucher}
                                        key={index}
                                        index={index}
                                        onRemove={removeVoucher}
                                        updateVouchers={updateVouchers}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between pt-2">
                                <CreateVoucherModal
                                    onAddingVouchers={addVouchers}
                                    open={openCreateVoucherModal}
                                    setOpen={setOpenCreateVoucherModal}
                                >
                                    <Button variant={"outline"} className="rounded-full border-gray-300">
                                        Add voucher <Plus />
                                    </Button>
                                </CreateVoucherModal>
                            </div>
                            {errorVouchers && vouchers.length === 0 && (
                                <p className="text-red-500 text-sm">{errorVouchers}</p>
                            )}
                        </div>
                        <div className="">
                            <label className="block text-sm font-medium">Games</label>
                            <div className="flex flex-col gap-1 mt-1">
                                {gamesAndQuizzes.map((gameQuiz, index) => (
                                    <GameQuizItem
                                        item={gameQuiz}
                                        key={index}
                                        index={index}
                                        onRemove={removeGameAndQuiz}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between pt-2">
                                {hasFetched && (
                                    <SelectGameModal
                                        gamesAndQuizzes={gamesAndQuizzes}
                                        onAddingGamesAndQuizzes={addGamesAndQuizzes}
                                        startTimeQuiz={startTimeQuiz}
                                        setTimeQuiz={setStartTimeQuiz}
                                    >
                                        <Button variant={"outline"} className="rounded-full border-gray-300">
                                            Add game <Plus />
                                        </Button>
                                    </SelectGameModal>
                                )}
                            </div>
                            {errorGames && <p className="text-red-500 text-sm">{errorGames}</p>}
                        </div>
                    </div>
                </div>
                <div className="!mt-6 flex justify-center items-center gap-5 ">
                    <Button type="button" className="text-base cancel-btn-color" onClick={() => back(false)}>
                        Cancel
                    </Button>
                    <AnimationButton type="submit" className="block px-4 py-[.37rem]">
                        Update
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </AnimationButton>
                </div>
            </form>
        </>
    );
};

export default UpdateEventForm;

function VoucherItem({
    item,
    onRemove,
    updateVouchers,
    index,
}: {
    item: VoucherAmount;
    onRemove: (item: number) => void;
    updateVouchers: (voucherAmount: VoucherAmount, index: number) => void;
    index: number;
}) {
    const [openUpdateVoucherModal, setOpenUpdateVoucherModal] = useState(false);
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[3.5rem] h-[3.5rem]">
                <img
                    // src={
                    //     item.voucher.image
                    //         ? URL.createObjectURL(item.voucher.image)
                    //         : defaultVoucherImage
                    // }
                    src={defaultVoucherImage}
                    alt="Voucher image"
                    className="w-full h-full object-cover border"
                />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">
                    Discount <span className="dynamic-text">{item.discount}%</span>
                </p>
                <span className="text-sm">Quantity: {item.total}</span>
            </div>
            <div className="flex items-center gap-4 px-3">
                <UpdateVoucherModal
                    item={item}
                    index={index}
                    onUpdateVouchers={updateVouchers}
                    open={openUpdateVoucherModal}
                    setOpen={setOpenUpdateVoucherModal}
                >
                    <Info color="blue" strokeWidth={3} className="cursor-pointer" onClick={() => {}} />
                </UpdateVoucherModal>
                <Trash2 color="red" strokeWidth={2} className="cursor-pointer" onClick={() => onRemove(index)} />
            </div>
        </div>
    );
}

function GameQuizItem({
    item,
    onRemove,
    index,
}: {
    item: GameQuizType;
    onRemove: (item: number) => void;
    index: number;
}) {
    // console.log(item);
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img
                    src={item.game.image || defaultGameImage}
                    alt="Voucher image"
                    className="w-full h-full object-cover border"
                />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md dynamic-text">{item.game.name}</p>
                <span
                    dangerouslySetInnerHTML={{ __html: item.game.description }}
                    className="text-xs line-clamp-2 min-h-[1.8rem]"
                ></span>
                <div className="flex gap-x-5 flex-wrap">
                    <span className="text-xs font-semibold">
                        Allow trading:
                        <span
                            className={`px-1 py-[1px] rounded-sm text-[.7rem] ml-1 font-semibold ${
                                item.popUpItemsEnabled
                                    ? "border text-gradient border-gray-200"
                                    : "bg-red-500 text-white"
                            }`}
                        >
                            {item.popUpItemsEnabled ? "Yes" : "No"}
                        </span>
                    </span>
                    {item.quiz && (
                        <span className="text-xs">
                            <b className="mr-1">Start time:</b> {item.startTime}
                        </span>
                    )}
                </div>
                {item.quiz && (
                    <span className="text-xs font-semibold">
                        Quiz: <span className="text-gradient">{item.quiz.name}</span>
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 px-3">
                <Trash2 color="red" strokeWidth={2} className="cursor-pointer" onClick={() => onRemove(index)} />
            </div>
        </div>
    );
}
