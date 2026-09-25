"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { adminApiFetch } from "@/lib/api-client";
import type { CommentDTO, StudyDTO } from "@/types/api";
import { PostFormContainer, type PostFormEditProps } from "@/app/(public)/post/_components/PostFormContainer";

/** Map CommentDTO fields to PostFormContainer defaultValues shape */
function mapCommentToDefaults(c: CommentDTO, defaultCategory: string, defaultMajor: string): Record<string, unknown> {
  return {
    category: c.category ?? defaultCategory,
    rank_1: c.rank_1 ?? "",
    rank_2: c.rank_2 ?? "",
    year: c.year ?? 114,
    score: c.score ?? "",
    isPass: c.isPass ?? "true",
    out_maj: c.out_maj ?? defaultMajor,
    in_maj: c.in_maj ?? defaultMajor,
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
    otherStat: Array.isArray(s.otherStat)
      ? s.otherStat.map(({ name, value }) => ({ name, value }))
      : [],
  };
}

export default function AdminPostPage() {
  const searchParams = useSearchParams();
  const tPost = useTranslations("post");
  const tAdmin = useTranslations("admin");
  const type = searchParams.get("type") as "major" | "study" | null;
  const id = searchParams.get("id");

  const isValidParams = (type === "major" || type === "study") && id != null;

  const { data: comment } = useQuery<CommentDTO>({
    queryKey: ["admin-comment", id],
    queryFn: () => adminApiFetch<CommentDTO>(`/comments/${id}`),
    enabled: isValidParams && type === "major",
    staleTime: 0,
    gcTime: 0,
  });

  const { data: study } = useQuery<StudyDTO>({
    queryKey: ["admin-study", id],
    queryFn: () => adminApiFetch<StudyDTO>(`/studies/${id}`),
    enabled: isValidParams && type === "study",
    staleTime: 0,
    gcTime: 0,
  });

  if (!isValidParams) {
    return (
      <div className="p-8 text-center text-[var(--color-red)]">
        {tAdmin("invalidEditParams")}
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
    isAdmin: true,
      editDefaultValues:
      type === "major"
        ? mapCommentToDefaults(comment!, tPost("categoryTransfer"), tPost("defaultMajor"))
        : mapStudyToDefaults(study!),
  };

  return (
    <div className="pb-[25px]">
      <PostFormContainer {...editProps} />
    </div>
  );
}
