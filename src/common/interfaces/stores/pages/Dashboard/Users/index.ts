// UsersStore.ts
import type { ModalUser } from "@/common/interfaces/components";
import type { User } from "./User";

export interface UsersStore {
    users: User[];
    currentPage: number;
    itemsPerPage: number;
    nationalities: string[];
    gender: string;
    nationality: string;
    age: number;
    selectedUserId: string | null;
    setSelectedUserId: (id: string | null) => void;
    showModal: boolean;
    modalUser: ModalUser | null;
    getUsers: () => void;
    getNationalities: () => void;
    handlePageChange: (page: any) => void;
    handleItemsPerPageChange: (e: any) => void;
    handleGenderChange: (e: any) => void;
    handleNationalityChange: (e: any) => void;
    handleAgeChange: (e: any) => void;
    resetFilters: () => void;
    renderPageNumbers: (pages: number, currentPage: number) => (number | string)[];
    handleExportCSV: () => void;
    handleExportUserCSV: (userId: string) => void;
    handleEditUser: (userId: string) => void;
    handleDeleteUser: (navigate: any, userId: string) => void;
    handleViewUser: (navigate: any, userId: string) => void;
    handleSendMessage: (userId: string, message: { title: string; content: string }) => void;
    setShowModal: (showModal: boolean) => void;
    setModalUser: (modalUser: ModalUser | null) => void;
}