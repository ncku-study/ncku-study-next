"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Option { name: string; value: string }

interface FilterProps {
  type: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
}

// Mimics MUI outlined Select styling used in the Vite app.
export default function Filter({ type, options, value = '', onChange }: FilterProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 120 });

  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selectedOption = options[selectedIndex] ?? options[0];

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      // MUI's popover rounds the anchor position before positioning the paper.
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.max(Math.round(rect.width), 120),
    });
  };

  const openMenu = () => {
    if (options.length === 0) return;
    updateMenuPosition();
    setFocusedIndex(selectedIndex);
    setOpen(true);
  };

  const closeMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const selectOption = useCallback((index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    closeMenu();
  }, [closeMenu, onChange, options]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target === triggerRef.current) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((index) => Math.min(index + 1, options.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOption(focusedIndex);
      }
    };

    const handleViewportChange = () => updateMenuPosition();
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [closeMenu, focusedIndex, open, options.length, selectOption]);

  return (
    <div className="relative top-0.5 flex items-center w-fit mr-3 max-sm:scale-90 max-sm:top-0.5">
      <span className="relative -top-0.5 text-[1.5rem] max-sm:-top-0.5">{`${type} :`}</span>
      <div className="relative mx-4 min-w-48">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={type}
          disabled={options.length === 0}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
              event.preventDefault();
              closeMenu();
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              if (open) {
                setFocusedIndex((index) => Math.min(index + 1, options.length - 1));
              } else {
                openMenu();
              }
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              if (open) {
                setFocusedIndex((index) => Math.max(index - 1, 0));
              } else {
                openMenu();
              }
            } else if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              if (open) {
                selectOption(focusedIndex);
              } else {
                openMenu();
              }
            }
          }}
          className="relative h-16 w-full cursor-pointer rounded border border-control-border bg-filter-transparent px-0 pl-5 pr-13 pt-0 pb-0 text-select-text text-[1.5rem] leading-5 outline-none scale-y-95 disabled:border-disabled-border disabled:text-select-arrow"
          style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}
        >
          <span
            className={`absolute left-5 top-5 translate-x-0.5 lg:translate-x-0 -translate-y-0.5 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-[15px] leading-6 ${value === '' ? 'text-select-arrow' : 'text-select-text'}`}
            style={{ letterSpacing: '0.1407px' }}
          >
            {selectedOption?.name ?? ''}
          </span>
        </button>
        {/* Dropdown arrow matching MUI's SVG arrow */}
        <svg
          className={`pointer-events-none absolute right-3 top-3.5 w-6 h-6 shrink-0 translate-x-0.5 lg:translate-x-0 ${options.length > 0 ? 'fill-select-arrow' : 'fill-disabled-border'}`}
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ fontSize: '1.5rem' }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>

        {open && typeof document !== 'undefined' && createPortal(
          <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-40 bg-filter-transparent"
                onMouseDown={() => setOpen(false)}
              />
              <ul
                ref={menuRef}
                role="listbox"
                aria-label={type}
                tabIndex={-1}
                className="fixed z-50 m-0 max-h-screen list-none overflow-y-auto rounded bg-white outline-none shadow-select-menu"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  minWidth: `${menuPosition.width}px`,
                  padding: '8px 0',
                  borderRadius: '4px',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                }}
              >
                {options.map((option, index) => {
                  const isFocused = index === focusedIndex;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`major-filter-option box-border flex cursor-pointer items-center text-[15px] leading-normal text-select-text ${isFocused ? 'bg-hover' : 'bg-filter-transparent'}`}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '0',
                        letterSpacing: '0.1407px',
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOption(index)}
                    >
                      {option.name}
                    </li>
                  );
                })}
              </ul>
            </>,
            document.body,
          )}
      </div>
    </div>
  );
}
