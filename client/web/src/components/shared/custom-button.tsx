"use client";

export default function AnimationColorfulButton({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    props?: any;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`${className} relative inline-flex items-center justify-center overflow-hidden font-medium text-indigo-600 rounded-lg shadow-2xl group`}
        >
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-blue-600 rounded-full blur-md ease"></span>
            <span className="absolute inset-0 w-full h-full transition duration-700 group-hover:rotate-180 ease">
                <span className="absolute bottom-0 left-0 w-24 h-24 -ml-10 bg-pink-600 rounded-full blur-md"></span>
                <span className="absolute bottom-0 right-0 w-24 h-24 -mr-10 bg-purple-700 rounded-full blur-md"></span>
            </span>
            <span className="relative flex items-center text-white gap-2">{children}</span>
        </button>
    );
}

export function AnimationButton({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    props?: any;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`${className} relative inline-flex items-center justify-center overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-lg shadow-xl group hover:ring-0 hover:ring-purple- `}
        >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-white text-base font-semibold flex gap-2">{children}</span>
        </button>
    );
}
