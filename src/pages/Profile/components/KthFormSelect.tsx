import React from 'react';

interface KthFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  isReadOnly?: boolean;
}

export const KthFormSelect: React.FC<KthFormSelectProps> = ({
  label,
  options,
  required = false,
  error,
  placeholder = '-- Pilih Opsi --',
  isReadOnly = false,
  className = '',
  value,
  ...rest
}) => {
  const currentValue = (value as string) || '';
  const isCustomValue = currentValue && !options.includes(currentValue);

  if (isReadOnly) {
    return (
      <div className="w-full">
        <label className="block text-xs font-semibold text-[#185325] mb-1.5 ml-1">
          {label}
          {required && <span className="text-[#185325] ml-0.5">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            disabled
            value={currentValue || '-'}
            className="w-full rounded-full border border-[#84A98C] bg-[#F4F6F4] px-5 py-3 text-sm text-gray-800 cursor-default outline-none select-text"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-[#185325] mb-1.5 ml-1">
        {label}
        {required && <span className="text-[#185325] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={currentValue}
          className={`w-full rounded-full border border-[#84A98C] bg-[#F4F6F4] px-5 py-3 pr-10 text-sm text-gray-800 appearance-none outline-none transition-all duration-200 cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] ${
            error ? 'border-red-500 ring-1 ring-red-500' : ''
          } ${className}`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {isCustomValue && (
            <option value={currentValue}>{currentValue}</option>
          )}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-700">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1 ml-3 font-medium">{error}</p>}
    </div>
  );
};

export default KthFormSelect;
