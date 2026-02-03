import type { CardProps } from "@/common/interfaces"
import { CardNormal } from "./CardNormal";
import { CardDetails } from "./CardDetails";
export const Card = ({ title, data, children, onDelete, onView, onEdit, onExport, onMessage, className, type, dataType, showModal, onConfirm, onClose }: CardProps) => {
    const renderCardNormal = type === 'normal' && (<CardNormal className={className} title={title} data={data} children={children} onView={onView} onEdit={onEdit} onDelete={onDelete} onExport={onExport} onMessage={onMessage} dataType={dataType} showModal={showModal} onConfirm={onConfirm} onClose={onClose} />);
    const renderCardDetails = type === 'detail' && (<CardDetails children={children} data={data} className={className} />);
    return (
        <>
            {renderCardNormal}
            {renderCardDetails}
        </>)
}
