"use client";

import { SubscriptionForm } from "@/app/(subsystem)/counterpart/subscription/subscribe/subscribe-form";

export default function SubscribeNew() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gradient">Register new subscription</h1>
            </div>
            <div className="flex">
                <SubscriptionForm />
            </div>
        </div>
    );
}
