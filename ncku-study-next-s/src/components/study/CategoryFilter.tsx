'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { CategoryDTO } from '@/types/api';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export function CategoryFilter({ selectedCategories, onChange }: CategoryFilterProps) {
  const t = useTranslations('study');

  const { data: categories = [], isLoading } = useQuery<CategoryDTO[]>({
    queryKey: ['categories'],
    queryFn: () => apiFetch('/categories'),
  });

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      onChange(selectedCategories.filter((c) => c !== id));
    } else {
      onChange([...selectedCategories, id]);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse h-8 bg-gray-100 rounded w-full mb-4"></div>;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">{t('filterByCategory')}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className="focus:outline-none transition-transform active:scale-95"
            >
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={`rounded-[30px] px-3 py-1 cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors
                  ${isSelected ? 'bg-[var(--color-primary)] text-white border-transparent' : 'border-gray-300 text-gray-600'}
                `}
              >
                {category.name}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
