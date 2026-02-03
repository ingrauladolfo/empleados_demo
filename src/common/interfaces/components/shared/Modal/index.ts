import type { ReactNode } from "react";

// interfaces.ts
export interface ModalProps {
    message?: string;
    onClose?: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}
export interface SendMessageModalProps {
    user: {
        login: {
            uuid: string;
        };
        name: {
            first: string;
            last: string;
        };
    };
    onClose: () => void;
    onSendMessage?: (message: { title: string; content: string }) => void;

}

export interface Message {
    title: string;
    content: string;
    date: any;
}

export type ExtendedModalProps = ModalProps & { children?: ReactNode }
