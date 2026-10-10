import { CommentDTO, PaginatedResponse } from "@/types/api";
import { getPublicComments } from "@/lib/public-cache";
import { QueryClient } from "@tanstack/react-query";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

export { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

export async function prefetchAllComments(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ALL_COMMENTS_QUERY_KEY,
    queryFn: async () => {
      const data = await getPublicComments();
      return { data, total: data.length } satisfies PaginatedResponse<CommentDTO>;
    },
  });
}
