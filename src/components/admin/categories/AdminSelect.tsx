'use client';

import Select, { StylesConfig, GroupBase } from 'react-select';

export interface SelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
  className?: string;
}

const selectStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
  control: (base, state) => ({
    ...base,
    minHeight: '40px',
    borderRadius: '12px',
    borderColor: state.isFocused ? 'var(--theme-primary, #011736)' : '#f3f4f6',
    boxShadow: state.isFocused ? '0 0 0 1px var(--theme-primary, #011736)' : 'none',
    fontSize: '14px',
    fontWeight: 600,
    '&:hover': { borderColor: '#d1d5db' },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: state.isSelected
      ? 'var(--theme-primary, #011736)'
      : state.isFocused
        ? '#f3f4f6'
        : '#fff',
    color: state.isSelected ? '#fff' : '#374151',
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontWeight: 500 }),
  singleValue: (base) => ({ ...base, color: '#011736' }),
  indicatorSeparator: () => ({ display: 'none' }),
};

export default function AdminSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  isClearable = true,
  className = '',
}: AdminSelectProps) {
  const selected = options.find((o) => o.value === value) || null;

  return (
    <div className={`min-w-[180px] ${className}`}>
      <Select
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt?.value || '')}
        placeholder={placeholder}
        isClearable={isClearable}
        styles={selectStyles}
        classNamePrefix="admin-select"
      />
    </div>
  );
}
