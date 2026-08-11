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
    <div className="relative top-[1.71875px] flex items-center w-fit mr-[7px] max-sm:scale-90 max-[576px]:top-[1.55px]">
      <span className="relative top-[-1.71875px] text-[1.5rem] max-[576px]:top-[-1.55px]">{`${type} :`}</span>
      <div className="relative mx-[10px] min-w-[120px]">
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
          style={{
            fontSize: '1.5rem',
            lineHeight: '11.876px',
            height: '38.8125px',
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '14px',
            paddingRight: '32px',
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
            outline: 'none',
            width: '100%',
            color: 'rgba(0,0,0,0.87)',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          <span
            className="absolute left-[14px] top-[12px] max-w-[calc(100%-32px)] overflow-hidden text-ellipsis whitespace-nowrap text-left text-[15px] leading-[15px]"
            style={{ letterSpacing: '0.1407px' }}
          >
            {selectedOption?.name ?? ''}
          </span>
        </button>
        {/* Dropdown arrow matching MUI's SVG arrow */}
        <svg
          className="pointer-events-none absolute right-[7px] top-[7.40625px] w-[1em] h-[1em] shrink-0"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ fill: 'rgba(0,0,0,0.54)', fontSize: '1.5rem' }}
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>

        {open && typeof document !== 'undefined' && createPortal(
          <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-[1299] bg-transparent"
                onMouseDown={() => setOpen(false)}
              />
              <ul
                ref={menuRef}
                role="listbox"
                aria-label={type}
                tabIndex={-1}
                className="fixed z-[1300] m-0 max-h-[calc(100vh-96px)] list-none overflow-y-auto rounded-[4px] bg-white py-[8px] outline-none"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  minWidth: `${menuPosition.width}px`,
                  boxShadow:
                    '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
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
                      className="box-border flex h-[34.5px] cursor-pointer items-center px-[16px] py-[6px] text-[15px] leading-[22.5px] text-[rgba(0,0,0,0.87)] max-[576px]:h-[48px]"
                      style={{
                        backgroundColor: isFocused ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
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

