"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { CommentDTO, StudyDTO } from "@/types/api";
import { PostFormContainer, type PostFormEditProps } from "@/app/(public)/post/_components/PostFormContainer";

/** Map CommentDTO fields to PostFormContainer defaultValues shape */
function mapCommentToDefaults(c: CommentDTO): Record<string, unknown> {
  return {
    category: c.category ?? "\u8f49\u7cfb",
    rank_1: c.rank_1 ?? "",
    rank_2: c.rank_2 ?? "",
    year: c.year ?? 114,
    score: c.score ?? "",
    isPass: c.isPass ?? "true",
    out_maj: c.out_maj ?? "\u4e2d\u6587\u7cfb",
    in_maj: c.in_maj ?? "\u4e2d\u6587\u7cfb",
    department: c.department ?? "",
    comment: c.comment ?? "",
  };
}

/** Map StudyDTO fields to PostFormContainer defaultValues shape */
function mapStudyToDefaults(s: StudyDTO): Record<string, unknown> {
  const categoryNames = Array.isArray(s.category)
    ? s.category.map((c) => c.name)
    : [];
  return {
    title: s.title ?? "",
    content: s.content ?? "",
    year: s.year ?? 114,
    major: s.major ?? "",
    studyCategories: categoryNames,
  };
}

export default function AdminPostPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "major" | "study" | null;
  const id = searchParams.get("id");

  const isValidParams = (type === "major" || type === "study") && id != null;

  const { data: comment } = useQuery<CommentDTO>({
    queryKey: ["comment", id],
    queryFn: () => apiFetch<CommentDTO>(`/comments/${id}`),
    enabled: isValidParams && type === "major",
    staleTime: 5 * 60 * 1000,
  });

  const { data: study } = useQuery<StudyDTO>({
    queryKey: ["study", id],
    queryFn: () => apiFetch<StudyDTO>(`/studies/${id}`),
    enabled: isValidParams && type === "study",
    staleTime: 5 * 60 * 1000,
  });

  if (!isValidParams) {
    return (
      <div className="p-8 text-center text-[var(--color-red)]">
        {"\u7121\u6548\u7684\u7de8\u8f2f\u53c3\u6578\uff0c\u8acb\u5f9e\u5be9\u67e5\u9801\u9762\u9032\u5165\u7de8\u8f2f\u3002"}
      </div>
    );
  }

  // Wait until data is loaded before rendering the form so defaultValues are applied correctly
  if (type === "major" && !comment) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="w-8 h-8 border-4 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (type === "study" && !study) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="w-8 h-8 border-4 border-[var(--color-yellow)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const editProps: PostFormEditProps = {
    editMode: true,
    editType: type!,
    editId: id!,
    editDefaultValues:
      type === "major" ? mapCommentToDefaults(comment!) : mapStudyToDefaults(study!),
  };

  return (
    <div className="pb-[25px]">
      <PostFormContainer {...editProps} />
    </div>
  );
}
