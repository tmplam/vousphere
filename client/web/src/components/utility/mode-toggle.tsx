"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setTheme("light"); // Set default theme when a use first accesses the page
    }, []);
    // const theme = sessionStorage.getItem("theme") || "system";

    return (
        // Toggle theme without DropdownMenu
        <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
        // Toggle theme with DropdownMenu
        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //         <Button variant="outline" size="icon">
        //             <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        //             <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        //             <span className="sr-only">Toggle theme</span>
        //         </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end">
        //         <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        //         <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        //         <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        //     </DropdownMenuContent>
        // </DropdownMenu>
    );
}
