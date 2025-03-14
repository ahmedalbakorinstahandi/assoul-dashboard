"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  setPage: (page: number) => void;
  totalItems: number;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export const PaginationControls = ({
  currentPage,
  setPage,
  totalItems,
  pageSize,
  setPageSize,
}: PaginationControlsProps) => {
  const lastPage = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          عدد العناصر لكل صفحة:
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number.parseInt(value))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
            // Logic to show pages around current page
            let pageNum;
            if (lastPage <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= lastPage - 2) {
              pageNum = lastPage - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={i}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-8 h-8"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}

          {lastPage > 5 && currentPage < lastPage - 2 && (
            <>
              <span className="mx-1">...</span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8"
                onClick={() => handlePageChange(lastPage)}
              >
                {lastPage}
              </Button>
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        الصفحة {currentPage} من {lastPage} | إجمالي العناصر: {totalItems}
      </div>
    </div>
  );
};
