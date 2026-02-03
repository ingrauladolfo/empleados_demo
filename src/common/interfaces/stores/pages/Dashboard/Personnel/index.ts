import type { Personal } from "@/common/interfaces";
import type { Person } from "./Person";

// RolesStore.ts
export interface PersonnelStore {
    personnel: Person[],
    currentPage: number;
    itemsPerPage: number;
    selectedPersonId: string | null;
    modalPerson: Personal | null,
    showModal: boolean,
    getPersonnel: () => void;
    setSelectedPersonId: (id: string | null) => void;
    setShowModal: (showModal: boolean) => void;
    setModalPerson: (modalUser: Personal | null) => void;
    handlePageChange: (page: any) => void;
    handleItemsPerPageChange: (e: any) => void;
    renderPageNumbers: (pages: number, currentPage: number) => (number | string)[];
    handleViewPerson: (navigate: any, personId: string) => void;
    handleDeletePerson: (navigate: any, personId: string) => void;
    handleEditPerson: (personOrId: string) => void;
}