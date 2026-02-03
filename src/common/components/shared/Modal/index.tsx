import type { ExtendedModalProps } from '@/common/interfaces'
import { type FC } from 'react'
import { Button } from '../Button'
import { useTheme } from '@/common/context'
export const Modal: FC<ExtendedModalProps> = ({ message, onClose, onConfirm, confirmText, cancelText, children }) => {
    const { theme } = useTheme();
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center p-5 box-border z-50">
            <div className={`p-5 rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] w-full max-w-2xl ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)]' : 'bg-[#C6EBCA]'}`}>
                {/* If children provided, render it (form etc.), otherwise render simple message */}
                {children ? (
                    <div className={`mb-5 ${theme === 'dark' ? 'text-[#d1d1d1]' : 'text-[#030712]'}`}>
                        {children}
                    </div>
                ) : (
                    <p className={`text-[16px] mb-5 text-center ${theme === 'dark' ? 'text-[#d1d1d1]' : 'text-[#030712]'}`}>{message}</p>
                )}

                <div className="flex gap-4 justify-end">
                    {cancelText && (
                        <div className="w-40">
                            <Button
                                className={`w-full min-w-30 py-[0.6rem] px-[1.2rem] rounded-lg transform-none cursor-pointer hover:-translate-y-px opacity-[0.9] ${theme === "dark" ? 'bg-[#030712] text-[#d1d1d1]' : 'bg-[#d1d1d1] text-[#030712]'}`}
                                onClick={() => onClose && onClose()}
                            >
                                {cancelText}
                            </Button>
                        </div>
                    )}
                    {confirmText && (
                        <div className="w-40">
                            <Button
                                className={`w-full min-w-30 py-[0.6rem] px-[1.2rem] rounded-lg transform-none cursor-pointer hover:-translate-y-px shadow-inner shadow-white/8 ${theme === "dark" ? 'bg-[#d1d1d1] text-[#030712]' : 'bg-[#030712] text-[#d1d1d1]'}`}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
