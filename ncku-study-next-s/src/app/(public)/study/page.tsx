import { StudyList } from '@/components/study/StudyList';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('study');
  return {
    title: t('title'),
  };
}

export default function StudyPage() {
  // We can't use useTranslations in server component if we don't pass it down, but the children are client components that use it
  return (
    <>
      <StudyList />
    </>
  );
}
