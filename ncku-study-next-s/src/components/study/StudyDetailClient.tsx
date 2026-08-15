'use client';

import { useRouter } from 'next/navigation';
import type { StudyDTO } from '@/types/api';
import { useOptionalStudyModalRoute } from '@/components/major/MajorModalRouteContext';
import { StudyList } from './StudyList';
import StudyModal from './StudyModal';

interface StudyDetailClientProps {
  id: string;
  serverStudy?: StudyDTO;
}

export default function StudyDetailClient({ id, serverStudy }: StudyDetailClientProps) {
  const router = useRouter();
  const studyRoute = useOptionalStudyModalRoute();
  const routeId = studyRoute?.studyId;
  const currentId = routeId ?? id;
  const isClosed = studyRoute !== null && routeId === null;

  const handleClose = () => {
    if (studyRoute) {
      studyRoute.close('/study');
    } else {
      router.push('/study');
    }
  };

  return (
    <>
      <div className="fixed inset-0">
        <div className="ml-[140px] mt-[70px]">
          <StudyList renderClientModal={false} />
        </div>
      </div>

      {!isClosed && (
        <StudyModal
          id={currentId}
          serverStudy={currentId === id ? serverStudy : undefined}
          onClose={handleClose}
        />
      )}
    </>
  );
}
