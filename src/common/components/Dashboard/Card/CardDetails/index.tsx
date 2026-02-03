import type { CardProps } from "@/common/interfaces"
import { FaUser } from "react-icons/fa6"
export const CardDetails = ({ children, data, className = '', title }: CardProps) => {
    return (
        <div className={`relative max-w-100 w-full border border-[#EAECF0] rounded-lg overflow-hidden shadow-[0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)] p-4 box-border my-10 mx-auto  ${className}`}>
            <div className="flex flex-col items-center justify-center w-full gap-auto py-4 px-0">
                <div className="flex flex-col items-center justify-center w-full gap-2.5 p-0 mb-2.5">
                    <div className="flex flex-col items-center justify-center w-full gap-2.5 p-0 card-Details-info">
                        {title ?? <p className="text-[14px] leading-5 w-full text-center font-normal wrap-break-word text-white mb-0">{title}</p>}
                        {data?.name ? <p className="text-[14px] leading-5 w-full text-center font-normal wrap-break-word text-white mb-0">{data.name?.first} {data.name?.last}</p> : <p className="text-[14px] leading-5 w-full text-center font-normal wrap-break-word text-white mb-0">{data?.symbol}</p>}
                        <div className="flex justify-center items-center w-full max-w-17.5 h-16.25 gap-2.5 p-0">
                            {data?.picture?.medium ? (<img src={data?.picture?.medium} alt={data?.name?.first ?? 'avatar'} className="size-full object-contain" />) : (<FaUser className="size-full object-contain" />)}
                        </div>
                    </div>
                </div>
                <div className="p-4 w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}