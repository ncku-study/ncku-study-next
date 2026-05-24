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
    <section className="flex flex-wrap max-[576px]:justify-center w-full mb-6">
      <div className="flex items-center w-fit mr-[7px] max-sm:scale-90">
        <span className="mr-[10px]">{t('filterByCollege')} :</span>
        <select
          id="college"
          name="college"
          value={filters.college}
          onChange={handleChange}
          className="rounded-[4px] border border-[#c4c4c4] bg-transparent px-[14px] pt-[14.5px] pb-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[120px]"
        >
          <option value="">{t('filterByCollege')}</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.name} className="text-[15px]">{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center w-fit mr-[7px] max-sm:scale-90">
        <span className="mr-[10px]">{t('filterByDept')} :</span>
        <select
          id="department"
          name="department"
          value={filters.department}
          onChange={handleChange}
          disabled={!filters.college && departments.length === 0}
          className="rounded-[4px] border border-[#c4c4c4] bg-transparent px-[14px] pt-[14.5px] pb-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[120px] disabled:opacity-50"
        >
          <option value="">{t('filterByDept')}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name} className="text-[15px]">{d.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center w-fit mr-[7px] max-sm:scale-90">
        <span className="mr-[10px]">{t('filterByYear')} :</span>
        <select
          id="year"
          name="year"
          value={filters.year}
          onChange={handleChange}
          className="rounded-[4px] border border-[#c4c4c4] bg-transparent px-[14px] pt-[14.5px] pb-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[120px]"
        >
          <option value="">{t('filterByYear')}</option>
          {years.map((y) => (
            <option key={y} value={y.toString()} className="text-[15px]">{y}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
