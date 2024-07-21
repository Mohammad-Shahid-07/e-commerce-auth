"use server";

import { handleError } from "./lib/errorHandler";
import { db } from "./server/db";
import { getSession } from "./auth";

interface GetCategoriesInput {
  page: number;
  pageSize: number;
}
interface Session {
  email: string | null;
}

export const getCategories = async ({ page, pageSize }: GetCategoriesInput) => {
  try {
    const skip = (page - 1) * pageSize;
    const [categories, totalCount] = await Promise.all([
      db.category.findMany({
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      db.category.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      categories,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalCount,
      },
      message: "Fetch Successful"
    };
  } catch (error) {
    return handleError(error);
  }
};
interface SaveInterestInput {
  categoryIds: string[];
}

export const saveInterest = async (input: SaveInterestInput) => {
  try {
    const { categoryIds } = input;
    const session = await getSession();

    if (!session?.email) {
      throw new Error("User not logged in");
    }

    const email = session.email;
    const user = await db.user.findUnique({
      where: { email },
      include: { interests: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const existingCategories = await db.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    const existingCategoryIds = existingCategories.map(
      (category) => category.id,
    );

    if (existingCategoryIds.length !== categoryIds.length) {
      const invalidIds = categoryIds.filter(
        (id) => !existingCategoryIds.includes(id),
      );
      throw new Error(`Invalid category IDs: ${invalidIds.join(", ")}`);
    }

    await db.$transaction([
      db.userCategory.deleteMany({
        where: { userId: user.id },
      }),
      db.userCategory.createMany({
        data: existingCategoryIds.map((categoryId) => ({
          userId: user.id,
          categoryId,
        })),
      }),
    ]);

    return { success: true, message: "Interests saved successfully" };
  } catch (error) {
    return handleError(error);
  }
};

interface User {
  email: string;
  interests: {
    category: {
      id: string;
      name: string;
    };
  }[];
}

export const getUserInterests = async () => {
  try {
    const session: Session | null = await getSession();

    if (!session?.email) {
      throw new Error("User not logged in");
    }

    const email = session.email;
    const user: User | null = await db.user.findUnique({
      where: { email },
      include: {
        interests: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const interests = user.interests.map((interest) => ({
      id: interest.category.id,
      name: interest.category.name,
    }));

    return { success: true, interests };
  } catch (error) {
    return handleError(error);
  }
};
