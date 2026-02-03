import type { Person, Personal, PersonnelStore } from "@/common/interfaces";
import { create } from "zustand";
export const usePersonnelStore = create<PersonnelStore>((set, get) => ({
    personnel: [],
    currentPage: 1,
    itemsPerPage: 5,
    selectedPersonId: null,
    modalPerson: null,
    showModal: false,
    setSelectedPersonId: (id: string | null) => set({ selectedPersonId: id }),
    getPersonnel: () => {
        const people = localStorage.getItem('personnel');
        if (people) { set({ personnel: JSON.parse(people) }) }
    },
    setShowModal: (showModal: boolean) => set({ showModal }),
    setModalPerson: (modalPerson: Personal | null) => set({ modalPerson }),
    renderPageNumbers: () => {
        const pages = Math.ceil(get().personnel.length / get().itemsPerPage);
        const currentPage = get().currentPage;
        if (pages <= 5) { return Array(pages).fill(0).map((_, i) => i + 1); }
        const isNearStart = currentPage <= 3;
        const isNearEnd = currentPage >= pages - 2;
        const startPages = isNearStart ? Array(3).fill(0).map((_, i) => i + 1) : [1, 2, '...'];
        const middlePages = isNearStart || isNearEnd ? [] : [currentPage - 1, currentPage, currentPage + 1];
        const endPages = isNearEnd ? Array(3).fill(0).map((_, i) => pages - 2 + i) : ['...', pages - 1, pages];
        return [...startPages, ...middlePages, ...endPages];
    },
    handlePageChange: (page: any) => { if (page !== '...') { set({ currentPage: page }); } },
    handleItemsPerPageChange: (e: any) => { set({ itemsPerPage: parseInt(e.target.value), currentPage: 1 }); },
    handleViewPerson: (navigate: any, personId: string) => { set({ selectedPersonId: personId }); navigate(`/dashboard/person?id=${personId}`); },
    handleEditPerson: (personOrId: any) => {
        try {
            const allPeople = JSON.parse(localStorage.getItem('personnel') || '[]') as any[];

            let found: any = null;
            if (typeof personOrId === 'string') {
                found = allPeople.find(p => String(p.id) === String(personOrId));
            } else if (personOrId && typeof personOrId === 'object') {
                if (personOrId.id) {
                    found = allPeople.find(p => String(p.id) === String(personOrId.id)) || personOrId;
                } else {
                    found = allPeople.find(p => {
                        try { return p.user && personOrId.user && p.user.email === personOrId.user.email; } catch { return false; }
                    }) || personOrId;
                }
            }

            if (!found) {
                console.warn('handleEditPerson: persona no encontrada', personOrId);
                return;
            }

            // resolver role (puede venir como id, string, o objeto)
            const incomingRole = found?.role ?? personOrId?.role;
            const incomingJobTitle = incomingRole?.jobTitle ?? (typeof incomingRole === 'string' ? incomingRole : undefined);

            // intentar cargar roles desde localStorage para normalizar
            const rolesFromStorage = JSON.parse(localStorage.getItem('roles') || '[]') as any[];
            const foundRole = Array.isArray(rolesFromStorage)
                ? rolesFromStorage.find((r: any) => String(r.id) === String(incomingRole) || r.jobTitle === incomingJobTitle)
                : undefined;

            const roleSelectValue = foundRole
                ? (foundRole.id ?? foundRole.jobTitle)
                : (incomingRole?.id ?? incomingRole?.jobTitle ?? String(incomingRole ?? ''));

            // normalizar objeto que guardaremos en el store (usar la key que sí existe: modalPerson)
            const modalPersonData: any = {
                id: found?.id ?? null,
                user: found?.user ?? undefined,
                role: roleSelectValue, // ← aquí se usa (select controlado)
                name: found?.user?.name ?? { title: '', first: '', last: '' },
                dob: found?.user?.dob ?? found?.dob ?? { date: '', age: 0 },
            };

            // actualizar estado del store usando las keys que sí existen
            set({
                modalPerson: modalPersonData as any,     // store espera `modalPerson`
                showModal: true,
                selectedPersonId: modalPersonData.id ?? null,
            });
        } catch (err) {
            console.error('handleEditPerson error', err);
        }
    },


    handleDeletePerson: (navigate: any, userId: string) => {
        const peopleString = localStorage.getItem('personnel');
        if (!peopleString) return;
        const people: Person[] = JSON.parse(peopleString);
        const updatedPeople = people.filter((user: Person) => user.id !== userId);
        localStorage.setItem('personnel', JSON.stringify(updatedPeople));
        set({ personnel: updatedPeople });
        navigate(0); // Esto recarga la página actual sin cambiar la URL

    },
}))
