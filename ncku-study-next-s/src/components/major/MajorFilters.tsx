"use client";

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { CollegeDTO, DepartmentDTO } from '@/types/api';
import Filter from '@/components/Filter';

export interface FilterState {
  college: string;
  department: string;
  year: string;
  category: string;
}

interface MajorFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  isAdmin?: boolean;
}

const selectClass = "rounded-[4px] border border-[#c4c4c4] bg-transparent px-[14px] pt-[14.5px] pb-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[120px]";
const labelClass = "mr-[10px]";
const wrapClass = "flex items-center w-fit mr-[7px] max-sm:scale-90";

export function MajorFilters({ filters, onChange, isAdmin = false }: MajorFiltersProps) {
  const t = useTranslations('major');

  const { data: colleges = [] } = useQuery({
    queryKey: isAdmin ? ['admin-colleges'] : ['colleges'],
    queryFn: () => apiFetch<CollegeDTO[]>('/colleges', { noStore: isAdmin }),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const { data: allDepartments = [] } = useQuery({
    queryKey: isAdmin ? ['admin-departments'] : ['departments'],
    queryFn: () => apiFetch<DepartmentDTO[]>('/departments', { noStore: isAdmin }),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const departments = useMemo(() => {
    if (!filters.college) return allDepartments;
    return allDepartments.filter((d) => d.college === filters.college);
  }, [allDepartments, filters.college]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'college') {
      onChange({ ...filters, college: value, department: '' });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  // Dynamic year range: current ROC year down to 104 (2015)
  const currentRocYear = new Date().getFullYear() - 1911;
  const years = Array.from(
    { length: currentRocYear - 104 + 1 },
    (_, i) => currentRocYear - i
  );

  return (
    <section className="flex flex-wrap max-[576px]:justify-center w-full items-center h-full">
      <Filter
        type={t('filterByYear')}
        options={[{ name: t('allYears'), value: '' }, ...years.map((y) => ({ name: String(y), value: String(y) }))]}
        value={filters.year}
        onChange={(v) => onChange({ ...filters, year: v })}
      />

      <Filter
        type={t('filterByCategory')}
        options={[
          { name: t('allCategories'), value: '' },
          { name: t('categoryTransfer'), value: '轉系' },
          { name: t('categoryMinor'), value: '輔系' },
          { name: t('categoryDouble'), value: '雙主修' },
        ]}
        value={filters.category}
        onChange={(v) => onChange({ ...filters, category: v })}
      />

      <Filter
        type={t('filterByCollege')}
        options={[{ name: t('allColleges'), value: '' }, ...colleges.map((c) => ({ name: c.name, value: c.name }))]}
        value={filters.college}
        onChange={(v) => onChange({ ...filters, college: v, department: '' })}
      />

      <Filter
        type={t('filterByDept')}
        options={[{ name: t('allDepts'), value: '' }, ...departments.map((d) => ({ name: d.name, value: d.name }))]}
        value={filters.department}
        onChange={(v) => onChange({ ...filters, department: v })}
      />
    </section>
  );
}
