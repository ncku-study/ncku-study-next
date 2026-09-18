"use client";

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { adminApiFetch, apiFetch } from '@/lib/api-client';
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

export function MajorFilters({ filters, onChange, isAdmin = false }: MajorFiltersProps) {
  const t = useTranslations('major');

  const { data: colleges = [] } = useQuery({
    queryKey: isAdmin ? ['admin-colleges'] : ['colleges'],
    queryFn: () => isAdmin
      ? adminApiFetch<CollegeDTO[]>('/colleges')
      : apiFetch<CollegeDTO[]>('/colleges'),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const { data: allDepartments = [] } = useQuery({
    queryKey: isAdmin ? ['admin-departments'] : ['departments'],
    queryFn: () => isAdmin
      ? adminApiFetch<DepartmentDTO[]>('/departments')
      : apiFetch<DepartmentDTO[]>('/departments'),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const departments = useMemo(() => {
    if (!filters.college) return [];
    return allDepartments.filter((d) => d.college === filters.college);
  }, [allDepartments, filters.college]);

  // Dynamic year range: current ROC year down to 104 (2015)
  const currentRocYear = new Date().getFullYear() - 1911;
  const years = Array.from(
    { length: currentRocYear - 104 + 1 },
    (_, i) => currentRocYear - i
  );

  return (
    <section className="flex flex-wrap max-sm:justify-center w-full items-center h-full">
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
          { name: t('categoryTransfer'), value: t('categoryTransfer') },
          { name: t('categoryMinor'), value: t('categoryMinor') },
          { name: t('categoryDouble'), value: t('categoryDouble') },
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
        options={filters.college ? [{ name: t('allDepts'), value: '' }, ...departments.map((d) => ({ name: d.name, value: d.name }))] : []}
        value={filters.department}
        onChange={(v) => onChange({ ...filters, department: v })}
      />
    </section>
  );
}
