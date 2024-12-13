"use client";
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="bg-slate-200 flex justify-center items-center min-h-screen">{children}</div>;
}
