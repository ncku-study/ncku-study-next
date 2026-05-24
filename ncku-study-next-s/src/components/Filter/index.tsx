"use client";
import React from 'react';

interface Option { name: string; value: string }

interface FilterProps {
  type: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
}

// Mimics MUI outlined Select styling used in the Vite app.
export default function Filter({ type, options, value = '', onChange }: FilterProps) {
  return (
    <div className="flex items-center w-fit mr-[7px] max-sm:scale-90">
      <span className="text-[1.5rem]">{`${type} :`}</span>
      <div className="relative mx-[10px] min-w-[120px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontSize: '1.5rem',
            height: '38.8125px',
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '14px',
            paddingRight: '32px',
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
            outline: 'none',
            width: '100%',
            color: 'rgba(0,0,0,0.87)',
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ fontSize: '15px' }}>
              {o.name}
            </option>
          ))}
        </select>
        {/* Dropdown arrow matching MUI's SVG arrow */}
        <svg
          className="pointer-events-none absolute right-[7px] top-1/2 -translate-y-1/2 w-[1em] h-[1em] shrink-0"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ fill: 'rgba(0,0,0,0.54)', fontSize: '1.5rem' }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
    </div>
  );
}

