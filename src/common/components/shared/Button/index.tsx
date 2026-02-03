import type { ButtonProps } from '@/common/interfaces'
import { type FC } from 'react'

export const Button: FC<ButtonProps> = ({ disabled, children, onClick, type, href, className, ariaLabel, rounded = 'rounded-[5px]' }) => {
    return (
        href ?
            <a href={href} className={`w-full inline-flex items-center justify-center p-[clamp(0.5rem,1.6vw,0.9rem)] ${rounded} text-[16px] text-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-[background-color_.15s_ease,transform_.08s_ease] font-bold no-underline text-inherit hover:underline ${className}`}>
                {children}
            </a> : <button disabled={disabled} type={type} className={`w-full inline-flex items-center justify-center p-[clamp(0.5rem,1.6vw,0.9rem)] ${rounded} text-[16px] text-center cursor-pointer shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-[background-color_.15s_ease,transform_.08s_ease] font-bold ${className}`} aria-label={ariaLabel} onClick={onClick}            >
                {children}
            </button>
    );
}