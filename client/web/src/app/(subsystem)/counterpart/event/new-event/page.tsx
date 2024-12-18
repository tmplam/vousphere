"use client";

import CreateVoucherModal from "@/app/(subsystem)/counterpart/event/new-event/create-voucher-modal";
import SelectGameModal from "@/app/(subsystem)/counterpart/event/new-event/select-game";
import UpdateVoucherModal from "@/app/(subsystem)/counterpart/event/new-event/update-voucher-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { VoucherRequest } from "@/schema/event.schema";
import { GameType } from "@/schema/game.schema";
import { Info, Plus, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type VoucherAmount = {
    amount: number;
    voucher: VoucherRequest;
};

const EventForm = () => {
    const [name, setName] = useState("A new event demo");
    const [errorName, setErrorName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [errorImage, setErrorImage] = useState("");
    const [vouchers, setVouchers] = useState<VoucherAmount[]>([]);
    const [errorVouchers, setErrorVouchers] = useState("");
    const [startTime, setStartTime] = useState("");
    const [errorStartTime, setErrorStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [errorEndTime, setErrorEndTime] = useState("");
    const [games, setGames] = useState<GameType[]>([]);
    const [errorGames, setErrorGames] = useState("");
    const [loading, setLoading] = useState(false);
    const [openCreateVoucherModal, setOpenCreateVoucherModal] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const validateName = () => {
        if (!name.match(/\w+\s\w+/)) {
            setErrorName("Name is too short");
            return false;
        }
        setErrorName("");
        return true;
    };
    const validateImage = () => {
        if (!image) {
            setErrorImage("Image is required");
            return false;
        }
        setErrorImage("");
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
        if (!games || games.length === 0) {
            setErrorVouchers("You still not specify any game yet");
            return false;
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
        result &&= validateImage();
        result &&= validateName();
        result &&= validateStartTime();
        result &&= validateEndTime();
        result &&= validateVouchers();
        result &&= validateGames();
        return result;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!isValidate()) return;
        // Handle form submission
        const eventData = {
            name,
            image,
            vouchers,
            startTime,
            endTime,
            games: games.map((g) => g.id),
        };
        console.log(eventData);
        toast({
            description: "Add event successfully",
            duration: 2000,
            className: "bg-green-500 text-white",
        });
        // router.push("/counterpart/event");
    };

    const addVouchers = (newVoucherAmount: VoucherAmount) => {
        setVouchers([...vouchers, newVoucherAmount]);
    };

    const updateVouchers = (newVoucherAmount: VoucherAmount, index: number) => {
        console.log(newVoucherAmount);
        console.log(index);
        const newVouchers = [...vouchers];
        newVouchers.splice(index, 1, newVoucherAmount);
        setVouchers(newVouchers);
    };

    const removeVoucher = (index: number) => {
        const newVouchers = [...vouchers];
        newVouchers.splice(index, 1);
        setVouchers(newVouchers);
    };

    const addGames = (newGames: GameType[]) => {
        setGames([...newGames]);
    };

    const removeGame = (index: number) => {
        const newGameList = [...games];
        newGameList.splice(index, 1);
        setGames(newGameList);
    };

    return (
        <>
            <h1 className="text-4xl font-bold mb-6 text-gradient">Add new event</h1>
            <form
                onSubmit={handleSubmit}
                className="mx-auto p-6 rounded-lg shadow-md border border-gray-300 bg-white dark:bg-slate-900"
                noValidate
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="image">
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
                                onChange={(e) => {
                                    setImage(e.target.files ? e.target.files[0] : null);
                                }}
                            />
                            <p className="text-xs font-medium text-gray-400">
                                PNG, JPG SVG, WEBP, and GIF are Allowed.
                            </p>
                        </label>
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="your image"
                                className="mt-2 max-w-80 xl:max-w-96 max-h-80 object-cover mx-auto border rounded-md"
                            />
                        )}
                        {errorImage && !image && <p className="text-red-500 text-sm">{errorImage}</p>}
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
                                {games.map((game, index) => (
                                    <GameItem item={game} key={index} index={index} onRemove={removeGame} />
                                ))}
                            </div>
                            <div className="flex justify-between pt-2">
                                <SelectGameModal onAddingGames={addGames}>
                                    <Button variant={"outline"} className="rounded-full border-gray-300">
                                        Add game <Plus />
                                    </Button>
                                </SelectGameModal>
                            </div>
                            {errorVouchers && vouchers.length === 0 && (
                                <p className="text-red-500 text-sm">{errorVouchers}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="!mt-6 flex justify-center items-center gap-5 ">
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                        <Link href="/counterpart/event">Cancel</Link>
                    </Button>
                    <Button type="submit" className="block bg-lime-500 hover:bg-lime-600 text-white">
                        Add
                        {loading && <span className="ml-2 animate-spin">⌛</span>}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default EventForm;

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
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img
                    src={
                        item.voucher.image
                            ? URL.createObjectURL(item.voucher.image)
                            : "https://agencyvn.com/wp-content/uploads/2019/05/Voucher-l%C3%A0-g%C3%AC.jpg"
                    }
                    alt="Voucher image"
                    className="w-full h-full object-cover border"
                />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">Discount {item.voucher.value}%</p>
                <span className="text-xs line-clamp-2 min-h-[1.8rem]">{item.voucher.description}</span>
                <span className="text-sm">Quantity: {item.amount}</span>
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

function GameItem({ item, onRemove, index }: { item: GameType; onRemove: (item: number) => void; index: number }) {
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img src={item.image!} alt="Voucher image" className="w-full h-full object-cover border" />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">{item.name}</p>
                <span className="text-xs line-clamp-2 min-h-[1.8rem]">{item.guide}</span>
            </div>
            <div className="flex items-center gap-4 px-3">
                <Trash2 color="red" strokeWidth={2} className="cursor-pointer" onClick={() => onRemove(index)} />
            </div>
        </div>
    );
}
