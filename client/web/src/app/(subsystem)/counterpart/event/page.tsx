"use client";
import EventCard from "@/app/(subsystem)/counterpart/event/event-card";
import { Button } from "@/components/ui/button";
import { EventGameType } from "@/schema/event.schema";
import Link from "next/link";

const events: EventGameType[] = [
    {
        id: 1,
        name: "New Year 2024",
        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
        voucherCount: 10,
        startTime: "2024-12-01T10:00:00Z",
        endTime: "2024-12-01T12:00:00Z",
    },
    {
        id: 2,
        name: "A thank giving party 2024",
        image: "https://c8.alamy.com/comp/2JB7FMY/coupon-mockup-with-50-percent-off-discount-voucher-gift-coupon-coupon-promotion-sale-vector-2JB7FMY.jpg",
        voucherCount: 5,
        startTime: "2024-12-02T14:00:00Z",
        endTime: "2024-12-02T16:00:00Z",
    },
];

export default function Event() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold">Event</h1>
            </div>
            <Button>
                <Link href="/counterpart/event/new-event">New event</Link>
            </Button>

            <h3 className="text-4xl font-bold py-4">My event: </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-4 flex-wrap">
                {events.map((event, index) => (
                    <Link key={index} href={`/counterpart/event/${event.id}`}>
                        <EventCard key={index} {...event} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
