import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  iconRight,
  iconLeft,
  className = "",
  ...props
}) => {
  const baseStyle = "w-full cursor-pointer rounded-full py-3.5 font-semibold transition-colors flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#1B5E20] text-white hover:bg-[#113d1b]",
    outline: "bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 shadow-sm",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {iconLeft && <span>{iconLeft}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
};

export default Button;