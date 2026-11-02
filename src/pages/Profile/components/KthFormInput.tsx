import React from 'react';

interface KthFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  isReadOnly?: boolean;
}

export const KthFormInput: React.FC<KthFormInputProps> = ({
  label,
  required = false,
  error,
  isReadOnly = false,
  className = '',
  placeholder,
  value,
  ...rest
}) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-[#185325] mb-1.5 ml-1">
        {label}
        {required && <span className="text-[#185325] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          value={value ?? ''}
          placeholder={placeholder}
          readOnly={isReadOnly}
          disabled={isReadOnly}
          className={`w-full rounded-full border border-[#84A98C] bg-[#F4F6F4] px-5 py-3 text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs outline-none transition-all duration-200 ${
            isReadOnly
              ? 'cursor-default select-text'
              : 'focus:bg-white focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325]'
          } ${error ? 'border-red-500 ring-1 ring-red-500' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1 ml-3 font-medium">{error}</p>}
    </div>
  );
};

export default KthFormInput;
