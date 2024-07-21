"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { saveInterest, getCategories } from "@/actions";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

interface InterestsSelectionProps {
  initialCategories: Category[];
  initialPagination: Pagination | null;
  savedInterests: Category[];
}

const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
});

const InterestsSelection: React.FC<InterestsSelectionProps> = ({
  initialCategories,
  initialPagination,
  savedInterests,
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [pagination, setPagination] = useState<Pagination | null>(
    initialPagination,
  );
  const [loading, setLoading] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: savedInterests.map((interest) => interest.id),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await saveInterest({ categoryIds: data.interests });
      if (result.success) {
        toast.success("Interests saved successfully!");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
    setLoading(false);
  };

  const fetchCategories = (page: number) => {
    setAnimateOut(true);
    setTimeout(() => {
      void (async () => {
        try {
          const result = await getCategories({
            page,
            pageSize: pagination?.pageSize ?? 6,
          });
          if (result.success) {
            setCategories(result.categories);
            setPagination(result.pagination);
          } else {
            toast.error(`Error fetching categories: ${result.message}`);
          }
        } catch (error) {
          toast.error("An unexpected error occurred while fetching categories");
        } finally {
          setAnimateOut(false);
        }
      })();
    }, 300); // Match this delay with the animation duration
  };
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Please mark your interests!</CardTitle>
        <CardDescription>We will keep you notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {categories.map((category) => (
                <FormField
                  key={category.id}
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem
                      className={`flex flex-row items-start space-x-3 space-y-0 transition-all duration-300 ease-in-out ${
                        animateOut
                          ? "translate-y-4 transform opacity-0"
                          : "translate-y-0 transform opacity-100"
                      }`}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(category.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, category.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== category.id,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {category.name}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {pagination && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchCategories(1)}
                  disabled={pagination.currentPage === 1}
                  className="px-2 py-1 text-sm"
                >
                  &lt;&lt;
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchCategories(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-2 py-1 text-sm"
                >
                  &lt;
                </Button>
                {pagination.currentPage > 2 && (
                  <span className="px-3 py-1 text-sm">...</span>
                )}
                {Array.from({ length: pagination.totalPages })
                  .map((_, index) => index + 1)
                  .filter(
                    (page) =>
                      (page >= pagination.currentPage - 2 &&
                        page <= pagination.currentPage + 2) ||
                      (page >= pagination.currentPage - 1 &&
                        page <= pagination.currentPage + 1),
                  )
                  .map((page) => (
                    <Button
                      key={page}
                      type="button"
                      variant={
                        pagination.currentPage === page ? "default" : "outline"
                      }
                      onClick={() => fetchCategories(page)}
                      className="px-3 py-1 text-sm"
                    >
                      {page}
                    </Button>
                  ))}
                {pagination.currentPage < pagination.totalPages - 1 && (
                  <span className="px-3 py-1 text-sm">...</span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchCategories(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-2 py-1 text-sm"
                >
                  &gt;
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchCategories(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-2 py-1 text-sm"
                >
                  &gt;&gt;
                </Button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Interests"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InterestsSelection;
