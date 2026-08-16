'use client';

import { StudyList } from '@/components/study/StudyList';

export default function AdminStudyPage() {
  return <StudyList isAdmin={true} />;
}

