import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-tracker-border bg-tracker-surface hover:bg-tracker-hover transition-colors"
      >
        {selected?.color && (
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selected.color }} />
        )}
        {selected?.label}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-36 bg-white rounded-lg shadow-lg border border-tracker-border py-1 animate-in fade-in slide-in-from-top-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); close(); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-tracker-hover transition-colors flex items-center gap-2 ${opt.value === value ? 'font-semibold text-tracker-primary' : 'text-tracker-text'}`}
            >
              {opt.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Multi-select variant
interface MultiDropdownProps {
  options: DropdownOption[];
  values: string[];
  onChange: (values: string[]) => void;
  label: string;
  className?: string;
}

export const MultiDropdown: React.FC<MultiDropdownProps> = ({ options, values, onChange, label, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (val: string) => {
    onChange(values.includes(val) ? values.filter((v) => v !== val) : [...values, val]);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-tracker-border bg-tracker-surface hover:bg-tracker-hover transition-colors"
      >
        {label}
        {values.length > 0 && (
          <span className="bg-tracker-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {values.length}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-44 bg-white rounded-lg shadow-lg border border-tracker-border py-1 animate-in fade-in slide-in-from-top-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-tracker-hover transition-colors flex items-center gap-2"
            >
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${values.includes(opt.value) ? 'bg-tracker-primary border-tracker-primary' : 'border-tracker-border'}`}>
                {values.includes(opt.value) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
