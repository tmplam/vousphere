"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function CustomShadcnPagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const currentInputRef = useRef<HTMLInputElement>(null);
    const handleJumpToPage = (maxPage: number) => {
        const inputValue = currentInputRef.current?.value;
        if (!inputValue) return;
        if (parseInt(inputValue) > 0 && parseInt(inputValue) <= maxPage) {
            // router.push(`${path}${parseInt(inputValue)}`);
            onPageChange(parseInt(inputValue));
        }
    };
    return (
        <div className="flex items-center justify-between flex-col gap-2">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {currentPage > 1 ? (
                            <PaginationPrevious
                                className="cursor-pointer"
                                onClick={() => onPageChange(currentPage - 1)}
                            />
                        ) : (
                            <PaginationPrevious className="disabled" />
                        )}
                    </PaginationItem>
                    {currentPage === totalPages && totalPages > 2 && (
                        <PaginationItem key={1}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (page === currentPage || page === currentPage - 1 || page === currentPage + 1) {
                            return (
                                <PaginationItem key={page}>
                                    {page === currentPage ? (
                                        <PaginationLink isActive className="current-page">
                                            {page}
                                        </PaginationLink>
                                    ) : (
                                        <PaginationLink onClick={() => onPageChange(page)} className="cursor-pointer">
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            );
                        } else if (
                            (page === currentPage - 2 || page === currentPage + 2) &&
                            currentPage !== 1 &&
                            currentPage !== totalPages
                        ) {
                            return (
                                <PaginationItem key={page}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        } else {
                            return null;
                        }
                    })}
                    {currentPage === 1 && totalPages > 2 && (
                        <PaginationItem key={3}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        {currentPage < totalPages ? (
                            <PaginationNext onClick={() => onPageChange(currentPage + 1)} className="cursor-pointer" />
                        ) : (
                            <PaginationNext className="disabled" />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {totalPages > 7 && (
                <div className="inline-flex items-center gap-1">
                    <PaginationItem>
                        <Input
                            type="number"
                            defaultValue={currentPage}
                            min="1"
                            max={totalPages}
                            ref={currentInputRef}
                        />
                    </PaginationItem>
                    <Button onClick={() => handleJumpToPage(totalPages)} className="rounded-lg">
                        Jump
                    </Button>
                </div>
            )}
        </div>
    );
}
