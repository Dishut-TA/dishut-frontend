import React, { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi2";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

interface AnimatedSelectProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  required,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        {label}
      </label>

      {required && (
        <input
          type="text"
          required
          value={value}
          onChange={() => {}}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
        />
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border ${
          isOpen
            ? "border-[#185325] ring-2 ring-[#185325]/20"
            : "border-gray-300"
        } rounded-xl text-sm transition-all text-left ${
          disabled
            ? "bg-gray-50 cursor-not-allowed opacity-70"
            : "cursor-pointer hover:border-gray-400"
        }`}
      >
        <span
          className={
            selectedOption
              ? "text-gray-800 font-semibold"
              : "text-gray-400"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <HiChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl transition-all duration-200 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                option.disabled
                  ? "cursor-not-allowed bg-gray-50/50"
                  : "cursor-pointer hover:bg-emerald-50"
              } ${
                value === option.value ? "bg-emerald-50/50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold ${
                    option.disabled
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </span>

                {value === option.value && (
                  <HiCheck className="w-4 h-4 text-[#185325]" />
                )}
              </div>

              {option.badgeText && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${option.badgeColor}`}
                >
                  {option.badgeText}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSelect;