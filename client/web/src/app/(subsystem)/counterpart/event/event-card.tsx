"use client";
import { getEventStatusClassname } from "@/app/(subsystem)/admin/event/event-status-badge";
import { printDateTime, printTime, printTimeNoSecond } from "@/lib/utils";
import { EventGameType } from "@/schema/event.schema";
import { Calendar, Clock, Star, Ticket } from "lucide-react";

const EventCard = ({ event }: { event: EventGameType }) => {
    return (
        <div className="min-w-[290px] max-w-80 dark:bg-slate-800 rounded-xl border border-gray-200 overflow-hidden mx-auto">
            <img className="w-full h-48 object-cover border-b border-b-gray-200" src={event.image} alt="Event image" />
            <div className="p-3 pt-2 bg-slate-200 dark:bg-slate-800 space-y-1">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2 min-h-14">{event.name}</h2>
                <div className="flex gap-1">
                    <div className="w-28">
                        <div className="flex items-center gap-1 ">
                            <Star className="inline w-6" size={18} />
                            <b>Start time:</b>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <Calendar className="inline w-6" size={18} />
                            {new Date(event.startTime).toDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="inline w-6" size={18} />
                            {printTime(new Date(event.startTime))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <div className="w-28">
                        <div className="flex items-center gap-1">
                            <Star className="inline w-6" size={18} />
                            <b>End time:</b>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <Calendar className="inline w-6" size={18} />
                            {new Date(event.endTime).toDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="inline w-6" size={18} />
                            {printTime(new Date(event.endTime))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-1">
                    <p className="flex items-center gap-1">
                        <Ticket className="inline w-6" size={18} />
                        <b>Total vouchers:</b> {event.totalVouchers}
                    </p>
                    <b className={`${getEventStatusClassname(event.status)} rounded-lg py-[.2rem] px-2`}>
                        {event.status}
                    </b>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
