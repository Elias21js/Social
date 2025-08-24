import clsx from "clsx";
import style from "./button.module.css";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  selected?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, selected, ...props }, ref) => {
  return (
    <button ref={ref} className={clsx(style.b, className, selected && style.selected)} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
