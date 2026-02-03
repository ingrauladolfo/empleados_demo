import { itemsPerPageOptions, textRoles } from "@/assets/data";
import { Search, Modal, Button, NullResults, Form, Table, Pagination } from "@/common/components";
import { useLanguage, useTheme } from "@/common/context"
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Position, Role } from "@/common/interfaces";
import { useRolesStore } from "@/common/stores";
import { FaBriefcase, FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router";

export const DashboardRoles = () => {
    const { roles, getRoles, currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange, renderPageNumbers } = useRolesStore();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { lang } = useLanguage();
    const fetchDataRef = useRef(false);
    const [showModal, setShowModal] = useState(false);
    const [targetRoleId, setTargetRoleId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [modalRole, setModalRole] = useState<Position>({ id: '', jobTitle: "", salary: 0 });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const memoizedRoles = useMemo(() => Array.isArray(roles) ? roles : [], [roles]);
    const t = textRoles[lang] || textRoles.en;
    useLayoutEffect(() => { if (!fetchDataRef.current) { fetchDataRef.current = true; getRoles(); } }, [getRoles]);
    useLayoutEffect(() => {
        if (memoizedRoles.length && !targetRoleId) {
            const firstId = memoizedRoles[0]?.id ?? null;
            setTargetRoleId(firstId);
        }
    }, [memoizedRoles]);

    const baseFiltered = useMemo(() => memoizedRoles.map((r: any) => ({ ...r, nameString: r.jobTitle })), [memoizedRoles]);

    // display list = search-controlled OR all
    const displayList = searchResults !== null ? searchResults : baseFiltered;

    // pagination calculations
    const pagesCount = Math.max(1, Math.ceil((displayList || []).length / (itemsPerPage || 5)));
    const start = ((currentPage || 1) - 1) * (itemsPerPage || 5);
    const end = start + (itemsPerPage || 5);
    const paginated = (displayList || []).slice(start, end);

    const handleConfirm = () => {
        const errors: Record<string, string> = {};
        if (!String(modalRole.jobTitle || '').trim()) { errors['job.jobTitle'] = lang === 'es' ? 'Requerido' : 'Required'; }
        if (!(Number.isFinite(Number(modalRole.salary)) && Number(modalRole.salary) > 0)) { errors['job.salary'] = lang === 'es' ? 'Debe ser mayor que 0' : 'Must be > 0'; }
        if (Object.keys(errors).length) { setFormErrors(errors); return; }

        const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]") as Role[];
        const arr = Array.isArray(storedRoles) ? storedRoles : [];

        if (modalRole.id) {
            const idx = arr.findIndex(r => String(r.id) === String(modalRole.id));
            if (idx >= 0) {
                arr[idx] = { ...arr[idx], jobTitle: modalRole.jobTitle, salary: modalRole.salary };
            } else {
                arr.push({ id: modalRole.id, jobTitle: modalRole.jobTitle, salary: modalRole.salary });
            }
        } else {
            const newRole: Position = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, jobTitle: modalRole.jobTitle, salary: modalRole.salary };
            arr.push(newRole);
        }

        localStorage.setItem("roles", JSON.stringify(arr));
        getRoles();
        setShowModal(false);
        setModalRole({ id: '', jobTitle: "", salary: 0 });
        setFormErrors({});
    };

    // Table handlers
    const handleAdd = () => {
        setFormErrors({});
        setModalRole({ id: '', jobTitle: "", salary: 0 });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        const storedRoles = JSON.parse(localStorage.getItem("roles") || "[]") as Role[];
        const filtered = (storedRoles || []).filter(r => String(r.id) !== String(id));
        localStorage.setItem("roles", JSON.stringify(filtered));
        getRoles();
    };

    const handleEdit = (row: any) => {
        setFormErrors({});
        setModalRole({ id: row?.id ?? '', jobTitle: row?.jobTitle ?? String(row?.name ?? ''), salary: Number(row?.salary ?? 0) });
        setShowModal(true);
    };

    const handleView = (row: any) => {
        setModalRole({ id: row?.id ?? '', jobTitle: row?.jobTitle ?? String(row?.name ?? ''), salary: Number(row?.salary ?? 0) });
        setFormErrors({});
        setShowModal(true);
    };

    return (
        <div className={`flex flex-col items-center p-5 min-h-screen ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]' : 'bg-[#C6EBCA] text-[#030712]'}`}>
            <div className="flex items-center mb-5">
                <FaBriefcase className="text-[24px] mr-2.5" />
                <h1 className="text-[24px] m-0 ">{t.title}</h1>
            </div>

            <div className="mb-2.5 flex w-full justify-center md:justify-end px-4">
                <div className="flex items-baseline gap-4">
                    <Search
                        data={baseFiltered}
                        filterKey="nameString"
                        placeholder={lang === "es" ? "Buscar por nombre..." : "Search by jobTitle..."}
                        onSearch={(filtered, term) => {
                            setSearchResults(Array.isArray(filtered) ? filtered : null);
                            setSearchTerm(term ?? "");
                            handlePageChange(1);
                        }}
                    />
                    <Button
                        onClick={() => { setFormErrors({}); setShowModal(true); setModalRole({ id: '', jobTitle: "", salary: 0 }); handlePageChange(1); }}
                        type='button'
                        rounded="rounded-4xl"
                        className={`${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712]' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]'}`}
                    >
                        {lang === "es" ? "Nuevo" : "New"}
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-6xl px-4">
                {/* Table always mounted; pass NullResults as emptyState prop */}
                <Table
                    type="puesto"
                    data={{ rows: paginated }}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onView={handleView}
                    emptyState={<NullResults search={searchTerm} module={t.moduleName} />}
                />

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                    <Pagination
                        pages={renderPageNumbers(pagesCount, currentPage)}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        itemsPerPageOptions={itemsPerPageOptions}
                        t={t}
                    />
                </div>
            </div>
            <div className="basis-full order-99 flex justify-center items-center mt-5 box-border [@max-width:980px]:order-99 [@max-width:980px]:basis-full">
                <Button type="button" rounded="rounded-full" className={`${theme === "dark" ? "bg-[#C6EBCA] text-[#030712]" : "bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]"} py-2.5 px-5 border-none cursor-pointer w-fit!`} onClick={() => navigate(-1)}                >
                    <FaChevronLeft /> Regresar
                </Button>
            </div>
            {showModal && (
                <Modal onClose={() => { setShowModal(false); setFormErrors({}); }} onConfirm={handleConfirm} confirmText={lang === "es" ? "Guardar" : "Save"} cancelText={lang === "es" ? "Cancelar" : "Cancel"} >
                    <Form type="puesto" job={modalRole} setJob={setModalRole} formErrors={formErrors} />
                </Modal>
            )}
        </div>
    );
};
