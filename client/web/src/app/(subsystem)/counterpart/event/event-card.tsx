"use client";
import { Calendar, Ticket } from "lucide-react";

const EventCard = ({
    name,
    image,
    voucherCount,
    startTime,
    endTime,
}: {
    name: string;
    image: string;
    voucherCount: number;
    startTime: string;
    endTime: string;
}) => {
    return (
        <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
            <img className="w-full h-48 object-cover" src={image} alt={name} />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{name}</h2>
                <p className="text-gray-600">
                    <Calendar className="inline mr-1" /> <b>Start time:</b>
                    {new Date(startTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                    <Calendar className="inline mr-1" /> <b>End time:</b>
                    {new Date(endTime).toLocaleString()}
                </p>
                <p className="text-gray-600">
                    <Ticket className="inline mr-1" />
                    <b>Total vouchers:</b>: {voucherCount}
                </p>
            </div>
        </div>
    );
};

export default EventCard;
