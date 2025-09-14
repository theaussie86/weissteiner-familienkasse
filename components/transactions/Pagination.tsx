"use client";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getVisiblePages = () => {
    // Mobile: Weniger Seiten anzeigen, Desktop: Mehr Seiten
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    // Für sehr kleine Bildschirme: Nur aktuelle Seite + 1 Nachbar
    if (isMobile && totalPages > 5) {
      if (currentPage === 1) {
        return [1, 2, "...", totalPages];
      } else if (currentPage === totalPages) {
        return [1, "...", totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
        {/* Mobile: Zentriert, Desktop: Links */}
        <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
          Zeige {startItem} bis {endItem} von {totalItems} Einträgen
        </div>

        {/* Mobile: Kompakte Navigation, Desktop: Vollständige Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2 max-w-full overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 hidden sm:inline">Zurück</span>
          </Button>

          {/* Mobile: Nur aktuelle Seite und Nachbarseiten, Desktop: Vollständige Pagination */}
          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className="min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 text-xs sm:text-sm"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center px-2 sm:px-3"
          >
            <span className="mr-1 hidden sm:inline">Weiter</span>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
