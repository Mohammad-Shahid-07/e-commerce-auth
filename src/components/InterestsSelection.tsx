"use client";
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

const categoriesPerPage = 6;

const InterestsSelection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  useEffect(() => {
    // Mock data representing fetched categories
    const mockCategories: Category[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Category ${i + 1}`,
    }));
    setCategories(mockCategories);

    // Mock data representing user's saved interests
    const savedInterests = [1, 3, 5, 7]; // Assuming IDs of saved categories
    setSelectedInterests(savedInterests);
  }, []);

  const handleInterestToggle = (categoryId: number) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const pageCount = Math.ceil(categories.length / categoriesPerPage);

  const getPaginatedCategories = () => {
    const start = (currentPage - 1) * categoriesPerPage;
    const end = start + categoriesPerPage;
    return categories.slice(start, end);
  };

  const renderPaginationButtons = () => {
    const maxVisibleButtons = 5;
    const pageNumbers: number[] = [];

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2),
    );
    const endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <>
        <PaginationButton
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </PaginationButton>
        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </PaginationButton>
        {pageNumbers.map((number) => (
          <PaginationButton
            key={number}
            onClick={() => setCurrentPage(number)}
            variant={currentPage === number ? "pagination" : "outline"}
          >
            {number}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
        >
          {">"}
        </PaginationButton>
        <PaginationButton
          onClick={() => setCurrentPage(pageCount)}
          disabled={currentPage === pageCount}
        >
          {">>"}
        </PaginationButton>
      </>
    );
  };

  return (
    <div className="w-full max-w-lg space-y-8 rounded-3xl border border-[#C1C1C1] p-6">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <h2 className="mb-4 text-center text-3xl font-semibold text-gray-900">
          Please mark your interests!
        </h2>
        <p className="mb-10 text-center">We will keep you notified.</p>

        <div className="mb-6">
          <h3 className="mb-5 text-lg font-semibold">My saved interests!</h3>
          {getPaginatedCategories().map((category) => (
            <div key={category.id} className="mb-2 flex items-center">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedInterests.includes(category.id)}
                onCheckedChange={() => handleInterestToggle(category.id)}
              />
              <label htmlFor={`category-${category.id}`} className="ml-2">
                {category.name}
              </label>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">{renderPaginationButtons()}</div>
      </div>
    </div>
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "pagination" | "outline";
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = "outline",
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant={variant}
    className="p-0"
  >
    {children}
  </Button>
);

export default InterestsSelection;
