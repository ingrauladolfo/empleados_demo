import type { FC, ReactNode } from "react";
import { FaPlus, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { useLanguage } from "@/common/context";
import { textTable } from "@/assets/data";

type TableType = "personal" | "puesto" | "usuario";
type TableProps = {
    type?: TableType;
    data?: { rows: any[] };
    onAdd?: () => void;
    onDelete?: (id: string) => void;
    onEdit?: (row: any) => void;
    onView?: (row: any) => void;
    emptyState?: ReactNode; // recibe estado vacío desde el padre
};
export const Table: FC<TableProps> = ({ type, data, onAdd, onDelete, onEdit, onView, emptyState }) => {
    const { lang } = useLanguage();
    const t = textTable[lang] || textTable.en;
    const rows = Array.isArray(data?.rows) ? data.rows : [];
    const headers = type === "personal"
        ? ["#", t.user, t.role, t.salary, t.actions]
        : type === "puesto"
            ? ["#", t.jobTitle, t.salary, t.actions]
            : ["#", t.user, t.role, t.actions];

    const colCount = headers.length;

    return (
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((h, i) => {
                            if (h === t.actions) {
                                return (
                                    <th key={`h-${i}`} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        <div className="flex items-center justify-between">
                                            <span>{h}</span>
                                            {/* optional place for global Add button if needed */}
                                        </div>
                                    </th>
                                );
                            }
                            return (
                                <th key={`h-${i}`} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    {h}
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={colCount} className="px-4 py-6 text-center text-sm text-gray-500">
                                {emptyState ?? (t.noResults ?? "No results")}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row: any, idx: number) => {
                            const id = row?.id ?? `${idx}-${JSON.stringify(row).slice(0, 10)}`;
                            const user = row?.user ?? {};
                            const name = user?.name ?? {};
                            const role = row?.role ?? {};

                            return (
                                <tr key={id}>
                                    {type === "personal" ? (
                                        <>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{`${name.title || ""} ${name.first || ""} ${name.last || ""}`.replace(/\s+/g, " ").trim()}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(role && role.jobTitle) ?? role}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{role?.salary ?? ""}</td>
                                        </>
                                    ) : type === "puesto" ? (
                                        <>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(row?.jobTitle ?? row?.name ?? "")}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{row?.salary ?? ""}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{`${name.title || ""} ${name.first || ""} ${name.last || ""}`.replace(/\s+/g, " ").trim()}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(role && role.jobTitle) ?? role}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{role?.salary ?? ""}</td>
                                        </>
                                    )}

                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onAdd && onAdd()}
                                                className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                                            >
                                                <FaPlus />
                                            </button>
                                            <button onClick={() => onDelete && onDelete(id)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">
                                                <FaTrash />
                                            </button>
                                            <button onClick={() => onEdit && onEdit(row)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                                <FaEdit />
                                            </button>
                                            {type === "personal" && (
                                                <button onClick={() => onView && onView(row)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                    <FaEye />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
