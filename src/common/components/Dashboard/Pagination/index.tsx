import { Button } from "@/common/components/";
import type { PaginationProps } from "@/common/interfaces";
import type { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTheme } from "@/common/context";
export const Pagination: FC<PaginationProps> = ({ pages, currentPage, handlePageChange, itemsPerPage, handleItemsPerPageChange, itemsPerPageOptions, t }) => {
    const { theme } = useTheme();
    const textBorder = theme === 'dark' ? 'text-[#d1d1d1] border-[#e6e6e6]' : 'text-[#030712] border-[#101010]';
    // compute last numeric page (pages may include '...')
    const lastNumericPage = pages.reduce((acc: number, p) => typeof p === 'number' ? Math.max(acc, p) : acc, 1);
    const btnBase = `my-0 mx-1.25 py-1.25 px-2.5 border rounded ${theme === 'dark' ? 'bg-[#333] text-[#d1d1d1] border-[#e6e6e6]' : 'bg-[#fff] text-[#030712] border-[#101010]'} cursor-pointer`;
    const btnActive = `${theme === 'dark' ? 'bg-[#666] text-[#d1d1d1]' : 'bg-[#e6e6e6] text-[#030712]'}`;
    return (
        <div className={`flex flex-col sm:flex-row items-center mt-5 [@min-width:480px]:flex-row [@min-width:480px]:justify-between [@min-width:480px]:gap-2 [@min-width:480px]:w-full [@min-width:480px]:max-w-245 [@min-width:480px]:my-0 [@min-width:480px]:mx-auto`}>
            {/* left: pager */}
            <div className="flex flex-col gap-2">
                {/* label arriba */}
                <label htmlFor="items-per-page" className={`${textBorder} text-[14px]`}                >
                    {t.rowPerPage}
                </label>
                {/* select + paginación alineados */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <select id="items-per-page" className={`m-0 p-2.5 rounded-[5px] h-10 w-36 text-[16px] ${theme === 'dark' ? 'bg-[#333]' : 'bg-white'} ${textBorder}`} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        {itemsPerPageOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2">
                        <Button className={btnBase} onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}                        >
                            <FaChevronLeft />
                        </Button>

                        {pages.map((page, index) => {
                            const isActive = page === currentPage;
                            return (
                                <Button key={index} className={`${btnBase} ${isActive ? btnActive : ''}`} onClick={() => typeof page === 'number' && handlePageChange(page)} disabled={page === '...'}                                >
                                    {page}
                                </Button>
                            );
                        })}
                        <Button className={btnBase} onClick={() => handlePageChange(Math.min(lastNumericPage, currentPage + 1))} disabled={currentPage === lastNumericPage}>
                            <FaChevronRight />
                        </Button>
                    </div>

                </div>
            </div>

        </div>
    )
}
