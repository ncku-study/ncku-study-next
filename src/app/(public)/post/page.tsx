import { getTranslations } from "next-intl/server";
import { PostFormContainer } from "./_components/PostFormContainer";
import { buildSeoMetadata } from "@/lib/seo/metadata";

export const revalidate = 30;

export async function generateMetadata() {
  const t = await getTranslations("site");
  return buildSeoMetadata({
    title: t("title"),
    description: t("description"),
    pathname: "/post",
  });
}

export default function PostPage() {
  return (
    <div className="pb-10">
      <PostFormContainer />
    </div>
  );
}
