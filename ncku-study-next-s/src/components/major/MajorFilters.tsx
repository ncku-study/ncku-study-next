"use client";

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { CollegeDTO, DepartmentDTO } from '@/types/api';

export interface FilterState {
  college: string;
  department: string;
  year: string;
}

interface MajorFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function MajorFilters({ filters, onChange }: MajorFiltersProps) {
  const t = useTranslations('major');

  // Fetch colleges
  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => apiFetch<CollegeDTO[]>('/colleges'),
  });

  // Fetch all departments
  const { data: allDepartments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiFetch<DepartmentDTO[]>('/departments'),
  });

  // Filter departments by selected college
  const departments = useMemo(() => {
    if (!filters.college) return allDepartments;
    return allDepartments.filter((d) => d.college === filters.college);
  }, [allDepartments, filters.college]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If college changes, reset department
    if (name === 'college') {
      onChange({ ...filters, college: value, department: '' });
    } else {
      onChange({ ...filters, [name]: value });
    }
  };

  // Generate years (e.g., from 105 to 115)
  const years = Array.from({ length: 11 }, (_, i) => 115 - i);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-[var(--color-dark-white)] rounded-lg shadow-sm">
      <div className="flex-1">
        <label htmlFor="college" className="block text-sm font-medium text-[var(--color-light-black)] mb-1">
          {t('filterByCollege')}
        </label>
        <select
          id="college"
          name="college"
          value={filters.college}
          onChange={handleChange}
          className="w-full rounded-md border border-[var(--color-light-gray)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)]"
        >
          <option value="">{t('filterByCollege')}</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="department" className="block text-sm font-medium text-[var(--color-light-black)] mb-1">
          {t('filterByDept')}
        </label>
        <select
          id="department"
          name="department"
          value={filters.department}
          onChange={handleChange}
          disabled={!filters.college && departments.length === 0}
          className="w-full rounded-md border border-[var(--color-light-gray)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] disabled:opacity-50"
        >
          <option value="">{t('filterByDept')}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="year" className="block text-sm font-medium text-[var(--color-light-black)] mb-1">
          {t('filterByYear')}
        </label>
        <select
          id="year"
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="w-full rounded-md border border-[var(--color-light-gray)] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)]"
        >
          <option value="">{t('filterByYear')}</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
