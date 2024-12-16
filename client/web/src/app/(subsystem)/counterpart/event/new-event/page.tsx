"use client";

import { useState } from "react";

const EventForm = () => {
    const [name, setName] = useState("A new event demo");
    const [errorName, setErrorName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [errorImage, setErrorImage] = useState("");
    const [voucherCount, setVoucherCount] = useState(10);
    const [errorVoucherCount, setErrorVoucherCount] = useState("");
    const [startTime, setStartTime] = useState("");
    const [errorStartTime, setErrorStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [errorEndTime, setErrorEndTime] = useState("");

    const handleName = () => {
        if (!name.match(/\w+\s\w+/)) {
            setErrorName("Name is too short");
            return false;
        }
        setErrorName("");
        return true;
    };
    const handleImage = () => {
        if (!image) {
            setErrorImage("Image is required");
            return false;
        }
        setErrorImage("");
        return true;
    };

    const handleVoucherCount = () => {
        if (!voucherCount || voucherCount < 1 || voucherCount > 100) {
            setErrorVoucherCount("Voucher count must be at least 1");
            return false;
        }
        setErrorVoucherCount("");
        return true;
    };

    const handleStartTime = () => {
        if (!startTime) {
            setErrorStartTime("Start time is required");
            return false;
        }
        setErrorStartTime("");
        return true;
    };
    const handleEndTime = () => {
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
        result &&= handleName();
        result &&= handleImage();
        result &&= handleVoucherCount();
        result &&= handleStartTime();
        result &&= handleEndTime();
        return result;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!isValidate()) return;
        // Handle form submission
        const eventData = {
            name,
            image,
            voucherCount: Number(voucherCount),
            startTime,
            endTime,
        };
        console.log(eventData);
        // Reset form fields
        setName("");
        setImage(null);
        setVoucherCount(0);
        setStartTime("");
        setEndTime("");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded-lg shadow-md" noValidate>
            <h2 className="text-2xl font-bold mb-4">Create a new event</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Event name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrorName("");
                    }}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errorName && <p className="text-red-500">{errorName}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Event image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setImage(e.target.files ? e.target.files[0] : null);
                        setErrorImage("");
                    }}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errorImage && <p className="text-red-500">{errorImage}</p>}
                {image && <img src={URL.createObjectURL(image)} alt="your image" className="mt-2 h-60 mx-auto" />}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Số Lượng Voucher</label>
                <input
                    type="number"
                    value={voucherCount}
                    onChange={(e: any) => {
                        setVoucherCount(e.target.value);
                        setErrorVoucherCount("");
                    }}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errorVoucherCount && <p className="text-red-500">{errorVoucherCount}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Thời Gian Bắt Đầu</label>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => {
                        setStartTime(e.target.value);
                        setErrorStartTime("");
                    }}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errorStartTime && <p className="text-red-500">{errorStartTime}</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Thời Gian Kết Thúc</label>
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => {
                        setEndTime(e.target.value);
                        setErrorEndTime("");
                    }}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                />
                {errorEndTime && <p className="text-red-500">{errorEndTime}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600">
                Tạo Sự Kiện
            </button>
        </form>
    );
};

export default EventForm;
