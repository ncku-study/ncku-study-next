import type { QueryClient } from "@tanstack/react-query";
import { getPublicStudies } from "@/lib/public-cache";
import type { StudyDTO } from "@/types/api";
import { ALL_STUDIES_QUERY_KEY } from "@/lib/query-keys";

const STUDIES_STALE_TIME = 60_000;

export async function prefetchAllStudies(queryClient: QueryClient) {
  await queryClient.prefetchQuery<StudyDTO[]>({
    queryKey: ALL_STUDIES_QUERY_KEY,
    queryFn: async () => {
      return getPublicStudies();
    },
    staleTime: STUDIES_STALE_TIME,
  });
}
