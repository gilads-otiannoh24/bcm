import React from "react";
import classNames from "classnames";

type Variant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "error";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: Size;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses = classNames(
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    {
      "btn-block": fullWidth,
      loading: isLoading,
    },
    className
  );

  const loadingBaseClasses = classNames("loading", `loading-${size}`);

  return (
    <button
      className={baseClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className={loadingBaseClasses}></span>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};
export default Button;
