import { itemsPerPageOptions, textUsers } from "@/assets/data";
import { Search, Modal, Button, NullResults, Form, Card, Pagination } from "@/common/components";
import { useLanguage, useTheme } from "@/common/context"
import { useUsersStore } from "@/common/stores";
import { FaUsers } from "react-icons/fa"
import { useLayoutEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { ModalUser, User } from "@/common/interfaces";
import { useNavigate } from "react-router";
import { FaChevronLeft, FaPlus } from "react-icons/fa6";

export const DashboardUsers = () => {
    const { users, getUsers, getNationalities, currentPage, itemsPerPage, handlePageChange, handleEditUser, handleItemsPerPageChange, renderPageNumbers, nationalities, gender, nationality, age, handleGenderChange, handleNationalityChange, handleAgeChange, resetFilters, handleExportCSV, handleDeleteUser, handleViewUser, handleExportUserCSV, showModal, setShowModal, modalUser, setModalUser, selectedUserId, setSelectedUserId } = useUsersStore();
    const { theme } = useTheme();
    const { lang } = useLanguage();
    const t = textUsers[lang] || textUsers.en;
    const fetchDataRef = useRef(false);
    const navigate = useNavigate();
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<any[] | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const memoizedUsers = useMemo(() => Array.isArray(users) ? users : [], [users]);
    // wrapper para compatibilizar set del store con la firma esperada por <Form />
    const setModalUserFromForm: Dispatch<SetStateAction<ModalUser>> = (u) => {
        if (typeof u === "function") {
            const prev = modalUser as ModalUser | null;
            const next = (u as (prev: ModalUser | null) => ModalUser)(prev);
            setModalUser(next);
        } else { setModalUser(u); }
    };
    useLayoutEffect(() => {
        if (!fetchDataRef.current) {
            fetchDataRef.current = true;
            getUsers();
            getNationalities();
        }
    }, [getUsers, getNationalities]);
    useLayoutEffect(() => {
        if (memoizedUsers.length && !targetUserId) {
            const first = memoizedUsers[0];
            const firstId = first?.login?.uuid || first?.id?.value || first?.email;
            setTargetUserId(firstId || null);
        }
    }, [memoizedUsers]);
    const baseFiltered = useMemo(() => {
        return memoizedUsers.map((u: any) => {
            const title = u?.name?.title ?? "";
            const first = u?.name?.first ?? u?.login?.username ?? "";
            const last = u?.name?.last ?? "";
            return { ...u, nameString: `${title} ${first} ${last}`.replace(/\s+/g, " ").trim(), };
        });
    }, [memoizedUsers]);
    // Search-controlled list (searchResults can be null -> use baseFiltered)
    const displayList = searchResults !== null ? searchResults : baseFiltered;
    // apply UI filters on top of displayList
    const filteredDisplay = (displayList || []).filter((user: any) => {
        let isValid = true;
        if (gender && user.gender !== gender) { isValid = false; }
        if (nationality && user.nat !== nationality) { isValid = false; }
        if (age && user.dob?.age !== age) { isValid = false; }
        return isValid;
    });
    // pagination
    const pages = Math.max(1, Math.ceil(filteredDisplay.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
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
    // confirm (create or update)
    const handleConfirm = () => {
        const errors: Record<string, string> = {};
        if (!modalUser) {
            errors['form'] = lang === 'es' ? 'Datos inválidos' : 'Invalid data';
            setFormErrors(errors);
            return;
        }
        const name = (modalUser.name ?? {}) as { title?: string; first?: string; last?: string };
        const dobDate = modalUser.dob?.date;
        const ageCalc = calcAge(dobDate);
        if (!String(name?.title || '').trim()) { errors['name.title'] = lang === 'es' ? 'Requerido' : 'Required'; }
        if (!String(name?.first || '').trim()) { errors['name.first'] = lang === 'es' ? 'Requerido' : 'Required'; }
        if (!String(name?.last || '').trim()) { errors['name.last'] = lang === 'es' ? 'Requerido' : 'Required'; }
        if (!dobDate) { errors['dob.date'] = lang === 'es' ? 'Requerido' : 'Required'; }
        if (ageCalc === undefined) { errors['dob.date'] = lang === 'es' ? 'Fecha inválida' : 'Invalid date'; }
        if (Object.keys(errors).length) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        // leer array actual
        const all: any[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (selectedUserId) {
            // actualizar usuario existente: hacemos merge profundo para no perder campos no editados
            const updated = all.map(u => {
                const matches = (u?.login?.uuid && u.login.uuid === selectedUserId) || (u?.id?.value && u.id.value === selectedUserId) || (u?.email && u.email === selectedUserId);
                if (!matches) { return u; }
                const merged = { ...u, ...modalUser, name: { ...(u.name || {}), ...(modalUser.name || {}) }, dob: { ...(u.dob || {}), ...(modalUser.dob || {}), age: ageCalc ?? (modalUser.dob?.age ?? u.dob?.age ?? 0) }, location: { ...(u.location || {}), ...(modalUser.location || {}) }, login: { ...(u.login || {}), ...(modalUser.login || {}) }, picture: { ...(u.picture || {}), ...(modalUser.picture || {}) }, id: { ...(u.id || {}), ...(modalUser.id || {}) }, registered: { ...(u.registered || {}), ...(modalUser.registered || {}) } };
                return merged;
            });
            localStorage.setItem('users', JSON.stringify(updated));
            getUsers();
            // reset estado edición
            setSelectedUserId(null);
            setModalUser({ name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } });
            setShowModal(false);
            return;
        }
        // creación (nuevo usuario)
        const newFullUser: User = { gender: modalUser.gender ?? "", name: { title: modalUser.name?.title ?? "", first: modalUser.name?.first ?? "", last: modalUser.name?.last ?? "" }, location: modalUser.location ?? { street: { number: 0, name: "" }, city: "", state: "", country: "", postcode: '', coordinates: { latitude: "", longitude: "" }, timezone: { offset: "", description: "" } }, email: modalUser.email ?? "", login: { uuid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, username: modalUser?.login?.username ?? "", password: modalUser?.login?.password ?? "", salt: modalUser?.login?.salt ?? "", md5: modalUser?.login?.md5 ?? "", sha1: modalUser?.login?.sha1 ?? "", sha256: modalUser?.login?.sha256 ?? "" }, dob: { date: modalUser.dob?.date ?? "", age: ageCalc ?? (modalUser.dob?.age ?? 0) }, registered: { date: new Date().toISOString(), age: 0 }, phone: modalUser.phone ?? "", cell: modalUser.cell ?? "", id: { name: modalUser.id?.name ?? "", value: modalUser.id?.value ?? "" }, picture: { large: modalUser.picture?.large ?? "", medium: modalUser.picture?.medium ?? "", thumbnail: modalUser.picture?.thumbnail ?? "" }, nat: modalUser.nat ?? "" };
        all.push(newFullUser);
        localStorage.setItem('users', JSON.stringify(all));
        getUsers();
        setShowModal(false);
        setModalUser({ name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } });
    };
    const hasFilters = gender !== '' || nationality !== '' || age !== 0;
    return (
        <div className={`flex flex-col items-center p-5 min-h-screen ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]' : 'bg-[#C6EBCA] text-[#030712]'}`}>
            <div className="flex items-center mb-5">
                <FaUsers className="text-[24px] mr-2.5" />
                <h1 className="text-[24px] m-0 ">{t.title}</h1>
            </div>

            {/* filters / search row */}
            <div className="mb-2.5 flex flex-col lg:flex-row w-full justify-between items-center px-4 gap-4">
                <div className="flex flex-col lg:flex-row items-baseline gap-4 w-full md:w-auto justify-center md:justify-start">
                    <select id='select-gender' className="m-2.5 p-2.5 border border-[#ccc] rounded-[5px] bg-[#333] text-[#d1d1d1] text-[16px] w-50 focus: outline-none focus:border-[#666] focus:shadow-[0 0 1 #666]" value={gender} onChange={handleGenderChange}>
                        <option value="">{lang === 'es' ? 'Género' : 'Gender'}</option>
                        <option value="male">{lang === 'es' ? 'Masculino' : 'Male'}</option>
                        <option value="female">{lang === 'es' ? 'Femenino' : 'Female'}</option>
                    </select>
                    <select id='select-nationality' className="m-2.5 p-2.5 border border-[#ccc] rounded-[5px] bg-[#333] text-[#d1d1d1] text-[16px] w-50 focus: outline-none focus:border-[#666] focus:shadow-[0 0 1 #666]" value={nationality} onChange={handleNationalityChange}>
                        <option className='' value="">{lang === 'es' ? 'Nacionalidad' : 'Nationality'}</option>
                        {nationalities.map(nat => (
                            <option className='' key={nat} value={nat}>{nat}</option>
                        ))}
                    </select>
                    <div className="flex items-center">
                        <span className="text-[#030712] mr-2">0</span>
                        <input type="range" className="dashboard-users-filter m-2.5 p-2.5 border border-[#ccc] rounded-[5px] bg-[#333] text-[#d1d1d1] text-[16px] w-50 focus: outline-none focus:border-[#666] focus:shadow-[0 0 1 #666] mx-2" min="0" max="100" value={age} onChange={handleAgeChange} />
                        <span className="text-[#030712] ml-2">{age}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                        {hasFilters ? (
                            <div className="w-35 shrink-0">
                                <Button rounded="rounded-2xl" type="button" onClick={resetFilters} className={`w-full px-3 py-1.5 text-sm rounded-2xl whitespace-nowrap ${theme === "dark" ? "bg-[#C6EBCA] text-[#030712]" : "bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]"}`}>
                                    Restablecer
                                </Button>
                            </div>
                        ) : null}
                        <div className="w-35 shrink-0">
                            <Button rounded="rounded-2xl" type="button" onClick={handleExportCSV} className={`w-full px-3 py-1.5 text-sm rounded-2xl whitespace-nowrap ${theme === "dark" ? "bg-[#C6EBCA] text-[#030712]" : "bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]"}`} >
                                Exportar a CSV
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-baseline gap-4 w-full md:w-auto justify-center md:justify-end">
                    <Search data={baseFiltered} filterKey="nameString" placeholder={lang === "es" ? "Buscar por nombre..." : "Search by name..."} onSearch={(filtered, term) => { setSearchResults(Array.isArray(filtered) ? filtered : null); setSearchTerm(term ?? ""); handlePageChange(1); }} />
                    <Button onClick={() => { setFormErrors({}); setModalUser({ name: { title: "", first: "", last: "" }, dob: { date: "", age: 0 } }); setSelectedUserId(null); setShowModal(true); }} type='button' rounded="rounded-4xl" className={`${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712]' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]'}`}>
                        <FaPlus />
                    </Button>
                </div>
            </div>
            {filteredDisplay?.length === 0 ? (
                <NullResults text={searchTerm} module={t.moduleName} />
            ) : (
                <div className="grid grid-cols-[1fr] gap-5 [@min-width:480px]:grid-cols-2 md:grid-cols-4">
                    {filteredDisplay.slice(start, end).map((user: any) => (
                        <Card type="normal" dataType="user" key={user.login?.uuid ?? user.email ?? JSON.stringify(user)} data={user} title={`${user.name?.title ?? ''} ${user.name?.first ?? ''} ${user.name?.last ?? ''}`} onDelete={() => handleDeleteUser(navigate, user.login?.uuid)} onView={() => handleViewUser(navigate, user.login?.uuid)} onExport={() => handleExportUserCSV(user.login?.uuid)} onEdit={() => handleEditUser(user.login?.uuid ?? user)} onMessage={true} />))}
                </div>
            )}

            {showModal && (
                <Modal onClose={() => { setShowModal(false); setFormErrors({}); setModalUser(null); setSelectedUserId(null); }} onConfirm={handleConfirm} confirmText={lang === "es" ? "Guardar" : "Save"} cancelText={lang === "es" ? "Cancelar" : "Cancel"} >
                    <Form type="usuarios" user={modalUser as ModalUser} setUser={setModalUserFromForm} userNationalities={nationalities} formErrors={formErrors} />
                </Modal>
            )}
            <Pagination pages={renderPageNumbers(pages, currentPage)} currentPage={currentPage} handlePageChange={handlePageChange} itemsPerPage={itemsPerPage} handleItemsPerPageChange={handleItemsPerPageChange} itemsPerPageOptions={itemsPerPageOptions} t={t} />
            <div className="basis-full order-99 flex justify-center items-center mt-5 box-border [@max-width:980px]:order-99 [@max-width:980px]:basis-full">
                <Button type="button" rounded="rounded-full" className={`${theme === "dark" ? "bg-[#C6EBCA] text-[#030712]" : "bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]"} py-2.5 px-5 border-none cursor-pointer w-fit!`} onClick={() => navigate(-1)}                >
                    <FaChevronLeft /> Regresar
                </Button>
            </div>
        </div>
    )
}
