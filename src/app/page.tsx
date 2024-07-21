import InterestsSelection from "@/components/InterestsSelection";
import LogoutButton from "@/components/LogoutButton";
import { getCategories, getUserInterests } from "@/actions";

export default async function HomePage() {
  const categoriesResponse = await getCategories({ page: 1, pageSize: 6 });
  const userInterestsResponse = await getUserInterests();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LogoutButton />
      <InterestsSelection
        initialCategories={
          categoriesResponse.success ? categoriesResponse.categories : []
        }
        initialPagination={
          categoriesResponse.success ? categoriesResponse.pagination : null
        }
        savedInterests={
          userInterestsResponse.success ? userInterestsResponse.interests : []
        }
      />
    </main>
  );
}
