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
  category: string;
}

interface MajorFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const selectClass = "rounded-[4px] border border-[rgba(0,0,0,0.23)] bg-transparent px-[14px] py-[6.5px] text-[1.5rem] focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] min-w-[120px]";
const labelClass = "mr-[10px]";
const wrapClass = "flex items-center w-fit mr-[7px] max-sm:scale-90";

export function MajorFilters({ filters, onChange }: MajorFiltersProps) {
  const t = useTranslations('major');

  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: () => apiFetch<CollegeDTO[]>('/colleges'),
  });

  const { data: allDepartments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => apiFetch<DepartmentDTO[]>('/departments'),
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
      {/* Year */}
      <div className={wrapClass}>
        <span className={labelClass}>{t('filterByYear')} :</span>
        <select name="year" value={filters.year} onChange={handleChange} className={selectClass}>
          <option value="">{t('allYears')}</option>
          {years.map((y) => (
            <option key={y} value={y.toString()} className="text-[15px]">{y}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className={wrapClass}>
        <span className={labelClass}>{t('filterByCategory')} :</span>
        <select name="category" value={filters.category} onChange={handleChange} className={selectClass}>
          <option value="">{t('allCategories')}</option>
          <option value="轉系" className="text-[15px]">{t('categoryTransfer')}</option>
          <option value="輔系" className="text-[15px]">{t('categoryMinor')}</option>
          <option value="雙主修" className="text-[15px]">{t('categoryDouble')}</option>
        </select>
      </div>

      {/* College */}
      <div className={wrapClass}>
        <span className={labelClass}>{t('filterByCollege')} :</span>
        <select name="college" value={filters.college} onChange={handleChange} className={selectClass}>
          <option value="">{t('allColleges')}</option>
          {colleges.map((c) => (
            <option key={c.id} value={c.name} className="text-[15px]">{c.name}</option>
          ))}
        </select>
      </div>

      {/* Department */}
      <div className={wrapClass}>
        <span className={labelClass}>{t('filterByDept')} :</span>
        <select name="department" value={filters.department} onChange={handleChange} className={selectClass}>
          <option value="">{t('allDepts')}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name} className="text-[15px]">{d.name}</option>
          ))}
        </select>
      </div>
    </section>
  );
}

