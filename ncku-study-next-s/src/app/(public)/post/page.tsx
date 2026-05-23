import { getTranslations } from "next-intl/server";
import { PostFormContainer } from "./_components/PostFormContainer";

export async function generateMetadata() {
  const t = await getTranslations("post");
  return {
    title: t("title"),
  };
}

export default function PostPage() {
  return (
    <div className="container mx-auto py-12">
      <PostFormContainer />
    </div>
  );
}
