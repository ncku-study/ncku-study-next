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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <StudyList />
      </div>
    </div>
  );
}
