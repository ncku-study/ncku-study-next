import { getCommentRepository } from '@/lib/repositories';
import MajorGrid from '@/components/major/MajorGrid';

export default async function MajorPage() {
  const commentRepo = await getCommentRepository();
  const comments = await commentRepo.findAll({});

  const initialData = {
    data: comments,
    total: comments.length,
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <MajorGrid initialData={initialData} />
    </main>
  );
}
