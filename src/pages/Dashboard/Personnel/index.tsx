// src/common/pages/DashboardPersonnel.tsx
import { itemsPerPageOptions, textUsers } from "@/assets/data";
import { Search, Modal, Button, NullResults, Form, Table, Pagination } from "@/common/components";
import { useLanguage, useTheme } from "@/common/context";
import { FaUsers } from "react-icons/fa";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Position } from "@/common/interfaces";
import { useRolesStore, useUsersStore } from "@/common/stores";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router";

export const DashboardPersonnel = () => {
    const { users, getUsers, getNationalities } = useUsersStore();
    const { roles, getRoles } = useRolesStore();
    const { theme } = useTheme();
    const { lang } = useLanguage();
    const t = textUsers[lang] || textUsers.en;
    const fetchDataRef = useRef(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [personnelList, setPersonnelList] = useState<any[]>([]);
    // modal state
    const [modalPersonal, setModalPersonal] = useState<any>({ user: undefined, role: "", name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } });
    const [modalJob, setModalJob] = useState<Position>({ id: "", jobTitle: "", salary: 0 });
    // local pagination (personnel-specific)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    useLayoutEffect(() => {
        if (!fetchDataRef.current) {
            fetchDataRef.current = true;
            getUsers();
            getRoles();
            getNationalities?.();
            const stored = JSON.parse(localStorage.getItem("personnel") || "[]");
            setPersonnelList(Array.isArray(stored) ? stored : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const memoizedPersonnel = useMemo(() => personnelList || [], [personnelList]);
    const baseFiltered = useMemo(() => {
        return memoizedPersonnel.map(p => {
            const user = p.user || {};
            const title = user?.name?.title ?? "";
            const first = user?.name?.first ?? user?.login?.username ?? "";
            const last = user?.name?.last ?? "";
            const role = p?.role?.jobTitle ?? (typeof p.role === "string" ? p.role : "");
            return {
                ...p,
                nameString: `${title} ${first} ${last} — ${role}`.replace(/\s+/g, " ").trim(),
            };
        });
    }, [memoizedPersonnel]);

    // search-controlled list
    const displayList = searchResults !== null ? searchResults : baseFiltered;

    // pagination calculations
    const pagesCount = Math.max(1, Math.ceil((displayList || []).length / (itemsPerPage || 5)));
    const start = ((currentPage || 1) - 1) * (itemsPerPage || 5);
    const end = start + (itemsPerPage || 5);
    const paginated = (displayList || []).slice(start, end);

    // helper: render page numbers (same behaviour used elsewhere)
    const renderPageNumbers = (pages: number, current: number) => {
        if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
        const isNearStart = current <= 3;
        const isNearEnd = current >= pages - 2;
        const startPages = isNearStart ? [1, 2, 3] : [1, 2, '...'];
        const middlePages = isNearStart || isNearEnd ? [] : [current - 1, current, current + 1];
        const endPages = isNearEnd ? [pages - 2, pages - 1, pages] : ['...', pages - 1, pages];
        return [...startPages, ...middlePages, ...endPages];
    };

    const calcAge = (dateStr?: string): number | undefined => {
        if (!dateStr) { return undefined; }
        const b = new Date(dateStr);
        if (isNaN(b.getTime())) { return undefined; }
        const today = new Date();
        let age = today.getFullYear() - b.getFullYear();
        const mmddToday = (today.getMonth() + 1) * 100 + today.getDate();
        const mmddBirth = (b.getMonth() + 1) * 100 + b.getDate();
        if (mmddToday < mmddBirth) { age -= 1; }
        return age >= 0 ? age : 0;
    };
    const newId = () => (typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}${Math.floor(Math.random() * 100000)}`);
    // Table handlers
    const handleAdd = () => {
        setFormErrors({});
        setModalPersonal({ id: undefined, user: undefined, role: "", name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } });
        setModalJob({ id: "", jobTitle: "", salary: 0 });
        setCurrentPage(1);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        const stored = JSON.parse(localStorage.getItem("personnel") || "[]");
        const filtered = (stored || []).filter((p: any) => p.id !== id);
        localStorage.setItem("personnel", JSON.stringify(filtered));
        setPersonnelList(Array.isArray(filtered) ? filtered : []);
        // adjust page if needed
        const newPages = Math.max(1, Math.ceil(((filtered || []).length) / itemsPerPage));
        if (currentPage > newPages) { setCurrentPage(newPages); }
    };

    const handleEdit = (row: any) => {
        setFormErrors({});
        const incomingRole = row?.role;
        const incomingJobTitle = incomingRole?.jobTitle ?? (typeof incomingRole === 'string' ? incomingRole : undefined);
        const foundRole = roles?.find((r: any) => String(r.id) === String(incomingRole) || r.jobTitle === incomingJobTitle);
        const roleSelectValue = foundRole ? (foundRole.id ?? foundRole.jobTitle) : (incomingRole?.id ?? incomingRole?.jobTitle ?? String(incomingRole ?? ""));
        setModalPersonal({ id: row.id, user: row.user ?? undefined, role: roleSelectValue, name: row.user?.name ?? { title: "", first: "", last: "" }, dob: row.user?.dob ?? row.dob ?? { date: "", age: 0 } });
        setModalJob({ id: foundRole?.id ?? "", jobTitle: foundRole?.jobTitle ?? (incomingJobTitle ?? ""), salary: foundRole?.salary ?? (incomingRole?.salary ?? 0) });
        setShowModal(true);
    };

    const handleView = (row: any) => {
        // same as edit for now (modal opens with data)
        handleEdit(row);
    };

    // confirm (add or update)
    const handleConfirm = () => {
        const errors: Record<string, string> = {};
        const selUser = modalPersonal?.user;
        if (!selUser) {
            errors["personal.user"] = lang === "es" ? "Seleccione un usuario" : "Select a user";
        } else {
            const name = selUser?.name || {};
            if (!String(name?.first || "").trim() || !String(name?.last || "").trim()) {
                errors["personal.user"] = lang === "es" ? "Usuario inválido" : "Invalid user";
            }
            const dobDate = selUser?.dob?.date || modalPersonal?.dob?.date;
            const age = calcAge(dobDate);
            if (!dobDate || age === undefined) { errors["personal.dob"] = lang === "es" ? "Fecha de nacimiento inválida" : "Invalid birth date"; }
        }

        let resolvedRole: any = modalPersonal?.role;
        if (!resolvedRole) { errors["personal.role"] = lang === "es" ? "Seleccione un puesto" : "Select a role"; }
        else {
            if (typeof resolvedRole === "string") {
                const found = roles?.find((r: any) => r.id === resolvedRole || r.jobTitle === resolvedRole);
                if (found) { resolvedRole = { jobTitle: found.jobTitle, salary: found.salary }; }
                else resolvedRole = { jobTitle: resolvedRole, salary: modalJob?.salary ?? 0 };
            }
            if (!String(resolvedRole.jobTitle || "").trim()) { errors["personal.role"] = lang === "es" ? "Puesto inválido" : "Invalid role"; }
            if (!(Number.isFinite(Number(resolvedRole.salary)) && Number(resolvedRole.salary) > 0)) { errors["personal.salary"] = lang === "es" ? "Salario debe ser > 0" : "Salary must be > 0"; }
        }

        if (Object.keys(errors).length) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        const existingId = modalPersonal?.id;
        const entry = {
            id: existingId || newId(),
            user: {
                name: modalPersonal.user?.name ?? modalPersonal.name ?? { title: "", first: "", last: "" },
                dob: modalPersonal.user?.dob ?? modalPersonal.dob ?? { date: "", age: calcAge(modalPersonal.dob?.date) ?? 0 },
                ...(modalPersonal.user ?? {})
            },
            role: {
                jobTitle: (resolvedRole && resolvedRole.jobTitle) || "",
                salary: Number((resolvedRole && resolvedRole.salary) || modalJob.salary || 0)
            }
        };

        const stored = JSON.parse(localStorage.getItem("personnel") || "[]");
        const arr = Array.isArray(stored) ? stored : [];
        if (existingId) {
            const idx = arr.findIndex((p: any) => p.id === existingId);
            if (idx >= 0) { arr[idx] = entry; }
            else { arr.push(entry); }
        } else { arr.push(entry); }

        localStorage.setItem("personnel", JSON.stringify(arr));
        setPersonnelList(arr);

        // ensure current page still valid after add
        const newPages = Math.max(1, Math.ceil(arr.length / itemsPerPage));
        if (currentPage > newPages) setCurrentPage(newPages);

        setShowModal(false);
        setModalPersonal({ user: undefined, role: "", name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } });
        setModalJob({ id: "", jobTitle: "", salary: 0 });
    };

    // pagination controls
    const handlePageChange = (page: number | string) => {
        if (page === '...') return;
        const n = Number(page);
        if (!Number.isNaN(n)) setCurrentPage(Math.max(1, Math.min(pagesCount, n)));
    };
    const handleItemsPerPageChange = (e: any) => {
        const val = Number(e.target?.value ?? e);
        const newVal = Number.isNaN(val) ? 5 : val;
        setItemsPerPage(newVal);
        setCurrentPage(1);
    };

    return (
        <div className={`flex flex-col items-center p-5 min-h-screen ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]' : 'bg-[#C6EBCA] text-[#030712]'}`}>
            <div className="flex items-center mb-5">
                <FaUsers className="text-[24px] mr-2.5" />
                <h1 className="text-[24px] m-0 ">{lang === "es" ? "Personal" : "Personnel"}</h1>
            </div>

            <div className="mb-2.5 flex w-full justify-center md:justify-end px-4">
                <div className="flex items-baseline gap-4">
                    <Search
                        data={baseFiltered}
                        filterKey="nameString"
                        placeholder={lang === "es" ? "Buscar por usuario o puesto..." : "Search by user or role..."}
                        onSearch={(filtered, term) => {
                            setSearchResults(Array.isArray(filtered) ? filtered : null);
                            setSearchTerm(term ?? "");
                            setCurrentPage(1);
                        }}
                    />
                    <Button onClick={handleAdd} type='button' rounded="rounded-4xl" className={`${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712]' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]'}`}>
                        {lang === "es" ? "Nuevo" : "New"}
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-6xl px-4">
                {/* Table always mounted; pass NullResults as emptyState */}
                <Table
                    type="personal"
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
                <Modal onClose={() => { setShowModal(false); setFormErrors({}); }} onConfirm={handleConfirm} confirmText={lang === "es" ? "Guardar" : "Save"} cancelText={lang === "es" ? "Cancelar" : "Cancel"}>
                    <Form type="personal" personal={modalPersonal} setPersonal={setModalPersonal as any} formErrors={formErrors} />
                </Modal>
            )}
        </div>
    );
};
