import { CommentDTO, PaginatedResponse } from "@/types/api";
import { getCommentRepository } from "@/lib/repositories";
import { QueryClient } from "@tanstack/react-query";
import { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

export { ALL_COMMENTS_QUERY_KEY } from "@/lib/query-keys";

export async function prefetchAllComments(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ALL_COMMENTS_QUERY_KEY,
    queryFn: async () => {
      const repo = await getCommentRepository();
      const data = await repo.findAll({});
      return { data, total: data.length } satisfies PaginatedResponse<CommentDTO>;
    },
  });
}
