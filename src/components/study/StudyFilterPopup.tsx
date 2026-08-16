'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApiFetch, apiFetch } from '@/lib/api-client';
import type { CategoryDTO, StatisticManageDTO } from '@/types/api';

// Material UI SVG paths — match the icons used in the Vite app exactly
const CATEGORY_PATH =
  'M12 2l-5.5 9h11zm0 3.84L13.93 9h-3.87zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22 22 19.99 22 17.5 19.99 13 17.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z';
const TIMELINE_PATH =
  'M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z';
const ACCESS_ALARM_PATH =
  'M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm.5-13H11v6l4.75 2.85.75-1.23-4-2.37V7z';

function getYearOptions(): { id: string; name: string }[] {
  const currentYear = new Date().getFullYear();
  const arr: { id: string; name: string }[] = [];
  for (let i = currentYear; i > currentYear - 5; i--) {
    const year = (i - 1911).toString();
    arr.push({ id: year, name: year + '年' });
  }
  return arr;
}

interface CheckboxItemProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

function CheckboxItem({ checked, label, onChange }: CheckboxItemProps) {
  return (
    <label className="inline-flex items-center cursor-pointer py-[5px] px-[10px] hover:bg-black/5 rounded-full justify-center w-full">
      <span
        className="flex items-center justify-center w-[18px] h-[18px] border-2 rounded-[2px] shrink-0"
        style={{
          backgroundColor: checked ? 'var(--color-yellow)' : 'transparent',
          borderColor: checked ? 'var(--color-yellow)' : 'var(--color-dark-gray)',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        tabIndex={-1}
      />
      <span className="ml-[4px] text-[14px] w-[60px]">{label}</span>
    </label>
  );
}

interface FilterSection {
  type: string;
  name: string;
  iconPath: string;
  options: { id: string; name: string }[];
}

export interface StudyFilterState {
  categories: string[];
  stats: string[];
  years: string[];
}

interface StudyFilterPopupProps {
  filter: StudyFilterState;
  onFilterChange: (filter: StudyFilterState) => void;
  isAdmin?: boolean;
}

export function StudyFilterPopup({ filter, onFilterChange, isAdmin = false }: StudyFilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: categories = [] } = useQuery<CategoryDTO[]>({
    queryKey: isAdmin ? ['admin-categories'] : ['categories'],
    queryFn: () => isAdmin
      ? adminApiFetch<CategoryDTO[]>('/categories')
      : apiFetch<CategoryDTO[]>('/categories'),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const { data: statistics = [] } = useQuery<StatisticManageDTO[]>({
    queryKey: isAdmin ? ['admin-statistics'] : ['statistics'],
    queryFn: () => isAdmin
      ? adminApiFetch<StatisticManageDTO[]>('/statistics')
      : apiFetch<StatisticManageDTO[]>('/statistics'),
    staleTime: isAdmin ? 0 : 60_000,
    gcTime: isAdmin ? 0 : 60_000,
  });

  const years = useMemo(() => getYearOptions(), []);

  const handleOpen = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupStyle({
        position: 'fixed',
        top: rect.bottom + 5,
        left: rect.left,
        zIndex: 1300,
      });
    }
    setIsOpen((o) => !o);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  const sections: FilterSection[] = [
    { type: 'category', name: '心得類別', iconPath: CATEGORY_PATH, options: categories },
    { type: 'statInfo', name: '數據資訊', iconPath: TIMELINE_PATH, options: statistics },
    { type: 'year', name: '涵蓋學年', iconPath: ACCESS_ALARM_PATH, options: years },
  ];

  const isSelected = (type: string, id: string) => {
    if (type === 'category') return filter.categories.includes(id);
    if (type === 'statInfo') return filter.stats.includes(id);
    if (type === 'year') return filter.years.includes(id);
    return false;
  };

  const handleToggle = (type: string, id: string, checked: boolean) => {
    if (type === 'category') {
      onFilterChange({
        ...filter,
        categories: checked
          ? [...filter.categories, id]
          : filter.categories.filter((c) => c !== id),
      });
    } else if (type === 'statInfo') {
      onFilterChange({
        ...filter,
        stats: checked ? [...filter.stats, id] : filter.stats.filter((s) => s !== id),
      });
    } else if (type === 'year') {
      onFilterChange({
        ...filter,
        years: checked ? [...filter.years, id] : filter.years.filter((y) => y !== id),
      });
    }
  };

  const popupEl = isOpen ? (
    <div
      ref={popupRef}
      style={popupStyle}
      className="bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-[5px] py-[10px] outline-none"
    >
      <div className="flex flex-row py-[10px]">
        {sections.map((section, i) => (
          <div
            key={section.type}
            className={`w-[114px] p-[5px]${i < sections.length - 1 ? ' border-r border-black/5' : ''}`}
          >
            <div
              className="flex justify-center items-center mb-[20px]"
              style={{ color: 'var(--color-dark-yellow)' }}
            >
              <svg
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '10px',
                  fill: 'var(--color-dark-yellow)',
                  flexShrink: 0,
                }}
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={section.iconPath} />
              </svg>
              {section.name}
            </div>
            <div className="flex flex-col">
              {section.options.map((option) => (
                <CheckboxItem
                  key={option.id}
                  checked={isSelected(section.type, option.id)}
                  label={option.name}
                  onChange={(checked) => handleToggle(section.type, option.id, checked)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className="w-full h-[38px] px-[14px] text-[1.5rem] bg-white border border-black/23 rounded-[4px] cursor-pointer text-left flex justify-between items-center text-black/87 hover:border-black/87 focus:outline-none"
      >
        <span>篩選條件</span>
        <svg
          className="w-[1em] h-[1em] ml-[4px] shrink-0"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {mounted && popupEl !== null && createPortal(popupEl, document.body)}
    </>
  );
}
