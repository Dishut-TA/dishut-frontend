interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  onIconClick,
  ...props
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-[#185325] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full px-5 py-3 border border-[#89C78E] rounded-full focus:outline-none focus:ring-1 focus:ring-[#185325] text-gray-700 placeholder-gray-400 bg-white"
          {...props}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#185325] hover:text-[#0f3618] transition-colors"
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField