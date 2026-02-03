// /common/interfaces/index.ts (o donde esté)
import type { ReactNode } from "react";
export interface CardProps {
    data: any;
    children?: ReactNode;
    onDelete?: () => void;
    onView?: () => void;
    onEdit?: () => void;
    onExport?: () => void;
    onClose?: () => void;
    onConfirm?: () => void;
    onMessage?: true;
    className?: string;
    type?: string;
    title?: string;
    dataType?: string;
    showModal?: boolean;
}