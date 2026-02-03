import type { ReactNode } from "react";

export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'submit' | 'reset' | 'button';
    href?: string;
    className?: string;
    ariaLabel?: string
    disabled?: any;
    rounded?: string
}