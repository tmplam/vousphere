import { getNotificationList } from "@/apis/notification-api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppSelector } from "@/lib/redux/hooks";
import { printDateTime } from "@/lib/utils";
import { Notification } from "@/schema/notification.shema";
import { BellRing } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Khiem workspace - notification icon on top right of the header for Admin*/

export default function AdminNotification({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const first3NewestNotifications: Notification[] = notifications.slice(0, 3);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const result = await getNotificationList();
                setNotifications(result.data);
            } catch (error) {
                console.log("");
            }
        };
        // Fetch Notifications
        setInterval(() => getNotifications(), 1000);
    }, []);
    return (
        <div className="p-0">
            <Popover>
                <PopoverTrigger className="flex items-center">
                    <div className="relative">
                        {children}
                        <div className="absolute top-0 right-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                            </span>
                        </div>
                    </div>
                </PopoverTrigger>
                {/* Render the two newest notifications below */}
                <PopoverContent className="mt-2 min-w-[23rem] p-0 border border-gray-200">
                    <p className="text-center font-semibold pt-1 border-b border-b-gray-200">Notification</p>
                    <ul className="py-1 divide-y">
                        {notifications.length == 0 && <p className="text-center">No notification</p>}
                        {notifications.length > 0 &&
                            first3NewestNotifications.map((notification, index) => (
                                <Link
                                    key={index}
                                    href={
                                        notification.message.startsWith("New brand") ? `/admin/users` : `/admin/event`
                                    }
                                    className="flex gap-2 hover:bg-gray-200 dark:hover:bg-slate-700 py-2 px-3 cursor-pointer"
                                >
                                    <div className="flex items-center justify-center w-8 md:w-12  dark:bg-slate-800 rounded-sm">
                                        <BellRing className="w-12 h-8 md:h-10 rounded-md object-cover m-auto" />
                                    </div>
                                    <div className="content flex-1">
                                        <div className="flex justify-between items-center">
                                            <h1 className="line-clamp-1 text-sm">{notification.title}</h1>
                                            <span className="text-[.75rem]">
                                                {printDateTime(new Date(notification.createdAt))}
                                            </span>
                                        </div>
                                        <p className="line-clamp-2 text-xs text-justify">{notification.message}</p>
                                    </div>
                                </Link>
                            ))}
                    </ul>
                    <div className="flex justify-center p-1 border-t border-t-gray-200">
                        <Link
                            href="/admin/notification"
                            className="text-sm text-sky-500 hover:text-sky-400 hover:underline"
                        >
                            View All
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
