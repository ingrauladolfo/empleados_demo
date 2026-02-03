import type { ModalUser, UsersStore } from "@/common/interfaces";
import { create } from "zustand";
export const useUsersStore = create<UsersStore>((set, get) => ({
    users: [],
    currentPage: 1,
    itemsPerPage: 5,
    nationalities: [],
    gender: '',
    nationality: '',
    age: 0,
    selectedUserId: null,
    modalUser: null,
    showModal: false,
    setSelectedUserId: (id: string | null) => set({ selectedUserId: id }),
    getUsers: () => {
        const users = localStorage.getItem('users');
        if (users) { set({ users: JSON.parse(users) }); }
    },
    getNationalities: () => {
        const nationalities = localStorage.getItem('userNationalities');
        if (nationalities) { set({ nationalities: JSON.parse(nationalities) }); }
    },
    handlePageChange: (page: any) => { if (page !== '...') { set({ currentPage: page }); } },
    handleItemsPerPageChange: (e: any) => { set({ itemsPerPage: parseInt(e.target.value), currentPage: 1 }); },
    handleGenderChange: (e: any) => { set({ gender: e.target.value, currentPage: 1 }); },
    handleNationalityChange: (e: any) => { set({ nationality: e.target.value, currentPage: 1 }); },
    handleAgeChange: (e: any) => { set({ age: parseInt(e.target.value), currentPage: 1 }); },
    resetFilters: () => { set({ gender: '', nationality: '', age: 0, currentPage: 1 }); },
    renderPageNumbers: () => {
        const pages = Math.ceil(get().users.length / get().itemsPerPage);
        const currentPage = get().currentPage;
        if (pages <= 5) { return Array(pages).fill(0).map((_, i) => i + 1); }
        const isNearStart = currentPage <= 3;
        const isNearEnd = currentPage >= pages - 2;
        const startPages = isNearStart ? Array(3).fill(0).map((_, i) => i + 1) : [1, 2, '...'];
        const middlePages = isNearStart || isNearEnd ? [] : [currentPage - 1, currentPage, currentPage + 1];
        const endPages = isNearEnd ? Array(3).fill(0).map((_, i) => pages - 2 + i) : ['...', pages - 1, pages];
        return [...startPages, ...middlePages, ...endPages];
    },
    handleExportCSV: async () => {
        try {
            const raw = await localStorage.getItem('users') || '[]';
            const allUsers: any[] = JSON.parse(raw);
            const { gender, nationality, age } = get();
            const hasGender = Boolean(gender && gender !== '');
            const hasNat = Boolean(nationality && nationality !== '');
            const hasAge = Boolean(age && age !== 0);
            const anyFilter = hasGender || hasNat || hasAge;
            const matches = (u: any) => {
                if (!u) { return false; }
                if (hasGender && u.gender !== gender) { return false; }
                if (hasNat && u.nat !== nationality) { return false; }
                if (hasAge && Number(u.dob?.age) !== Number(age)) { return false; }
                return true;
            };
            const toExport = anyFilter ? allUsers.filter(matches) : allUsers;
            const safe = (fn: () => any) => {
                try {
                    const v = fn();
                    return v === null || v === undefined ? '' : String(v);
                } catch { return ''; }
            };
            const rows = toExport.map(u => { return { uuid: safe(() => u.login?.uuid), username: safe(() => u.login?.username), gender: safe(() => u.gender), nameTitle: safe(() => u.name?.title), firstName: safe(() => u.name?.first), lastName: safe(() => u.name?.last), streetNumber: safe(() => u.location?.street?.number), streetName: safe(() => u.location?.street?.name), city: safe(() => u.location?.city), state: safe(() => u.location?.state), country: safe(() => u.location?.country), postcode: safe(() => u.location?.postcode), coordLatitude: safe(() => u.location?.coordinates?.latitude), coordLongitude: safe(() => u.location?.coordinates?.longitude), tzOffset: safe(() => u.location?.timezone?.offset), tzDescription: safe(() => u.location?.timezone?.description), email: safe(() => u.email), dobDate: safe(() => u.dob?.date), dobAge: safe(() => u.dob?.age), registeredDate: safe(() => u.registered?.date), registeredAge: safe(() => u.registered?.age), phone: safe(() => u.phone), cell: safe(() => u.cell), idName: safe(() => u.id?.name), idValue: safe(() => u.id?.value), pictureLarge: safe(() => u.picture?.large), pictureMedium: safe(() => u.picture?.medium), pictureThumbnail: safe(() => u.picture?.thumbnail), nat: safe(() => u.nat), raw: safe(() => JSON.stringify(u)), }; });
            const header = ['uuid', 'username', 'gender', 'nameTitle', 'firstName', 'lastName', 'streetNumber', 'streetName', 'city', 'state', 'country', 'postcode', 'coordLatitude', 'coordLongitude', 'tzOffset', 'tzDescription', 'email', 'dobDate', 'dobAge', 'registeredDate', 'registeredAge', 'phone', 'cell', 'idName', 'idValue', 'pictureLarge', 'pictureMedium', 'pictureThumbnail', 'nat', 'raw',];
            const escape = (v: any) => {
                if (v === null || v === undefined) { return ''; }
                const s = String(v);
                return `"${s.replace(/"/g, '""')}"`;
            };
            const csvLines = [header.join(',')];
            for (const r of rows) {
                const line = header.map((h) => escape((r as any)[h])).join(',');
                csvLines.push(line);
            }
            const csvContent = csvLines.join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const pad = (n: number) => String(n).padStart(2, '0');
            const now = new Date();
            const filename = `users_export_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) { console.error('Error exportando CSV', err); }
    },
    handleExportUserCSV: async (userId: string) => {
        try {
            const raw = await localStorage.getItem('users') || '[]';
            const allUsers: any[] = JSON.parse(raw);
            if (!userId) {
                console.warn('handleExportUserCSV: userId vacío');
                return;
            }
            const findUser = (u: any) => (u?.login?.uuid && u.login.uuid === userId) || (u?.id?.value && u.id.value === userId) || (u?.email && u.email === userId);
            const u = allUsers.find(findUser);
            if (!u) {
                console.warn('handleExportUserCSV: usuario no encontrado', userId);
                return;
            }
            const safe = (fn: () => any) => {
                try {
                    const v = fn();
                    return v === null || v === undefined ? '' : String(v);
                } catch { return ''; }
            };
            const row = { uuid: safe(() => u.login?.uuid), username: safe(() => u.login?.username), gender: safe(() => u.gender), nameTitle: safe(() => u.name?.title), firstName: safe(() => u.name?.first), lastName: safe(() => u.name?.last), streetNumber: safe(() => u.location?.street?.number), streetName: safe(() => u.location?.street?.name), city: safe(() => u.location?.city), state: safe(() => u.location?.state), country: safe(() => u.location?.country), postcode: safe(() => u.location?.postcode), coordLatitude: safe(() => u.location?.coordinates?.latitude), coordLongitude: safe(() => u.location?.coordinates?.longitude), tzOffset: safe(() => u.location?.timezone?.offset), tzDescription: safe(() => u.location?.timezone?.description), email: safe(() => u.email), dobDate: safe(() => u.dob?.date), dobAge: safe(() => u.dob?.age), registeredDate: safe(() => u.registered?.date), registeredAge: safe(() => u.registered?.age), phone: safe(() => u.phone), cell: safe(() => u.cell), idName: safe(() => u.id?.name), idValue: safe(() => u.id?.value), pictureLarge: safe(() => u.picture?.large), pictureMedium: safe(() => u.picture?.medium), pictureThumbnail: safe(() => u.picture?.thumbnail), nat: safe(() => u.nat), raw: safe(() => JSON.stringify(u)), };
            const header = ['uuid', 'username', 'gender', 'nameTitle', 'firstName', 'lastName', 'streetNumber', 'streetName', 'city', 'state', 'country', 'postcode', 'coordLatitude', 'coordLongitude', 'tzOffset', 'tzDescription', 'email', 'dobDate', 'dobAge', 'registeredDate', 'registeredAge', 'phone', 'cell', 'idName', 'idValue', 'pictureLarge', 'pictureMedium', 'pictureThumbnail', 'nat', 'raw',];
            const escape = (v: any) => {
                if (v === null || v === undefined) return '';
                const s = String(v);
                return `"${s.replace(/"/g, '""')}"`;
            };
            const csvLines = [header.join(',')];
            const line = header.map(h => escape((row as any)[h])).join(',');
            csvLines.push(line);
            const csvContent = csvLines.join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const pad = (n: number) => String(n).padStart(2, '0');
            const now = new Date();
            console.log({ row })
            const filename = `user_export_${row.uuid || 'unknown'}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) { console.error('Error exportando CSV usuario', err); }
    },

    // handleEditUser: recibe id o user object -> guarda modalUser completo + selectedUserId
    handleEditUser: (userOrId: any) => {
        try {
            const all = JSON.parse(localStorage.getItem('users') || '[]') as any[];

            let found: any = null;
            if (typeof userOrId === 'string') {
                found = all.find(u =>
                    (u?.login?.uuid && u.login.uuid === userOrId) ||
                    (u?.id?.value && u.id.value === userOrId) ||
                    (u?.email && u.email === userOrId)
                );
            } else if (userOrId && typeof userOrId === 'object') {
                // si recibieron el objeto, usarlo (asegurar que viene de la lista o es válido)
                found = userOrId;
            }

            if (!found) {
                console.warn('handleEditUser: usuario no encontrado', userOrId);
                return;
            }

            // asegurarnos que name y dob existen (ModalUser requiere eso)
            const modalUser: ModalUser = {
                ...found,
                name: {
                    title: found?.name?.title ?? '',
                    first: found?.name?.first ?? '',
                    last: found?.name?.last ?? ''
                },
                dob: {
                    date: found?.dob?.date ?? '',
                    age: found?.dob?.age ?? 0
                }
            };

            // guardar el usuario completo para edición y marcar selectedUserId
            const id = found?.login?.uuid || found?.id?.value || found?.email || null;
            set({ modalUser, showModal: true, selectedUserId: id });
        } catch (err) {
            console.error('handleEditUser error', err);
        }
    },


    handleDeleteUser: (navigate: any, userId: string) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter((user: any) => user.login.uuid !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        set({ users: updatedUsers });
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (userProfile.login && userProfile.login.uuid === userId) {
            localStorage.removeItem('userProfile')
            localStorage.removeItem('userNationalities')
            localStorage.removeItem('userMessages')
            localStorage.removeItem('users')
            navigate('/');
        }
    },
    handleViewUser: (navigate: any, userId: string) => {
        set({ selectedUserId: userId });
        navigate(`/dashboard/user?id=${userId}`);
    },

    handleSendMessage: (userId: string, message: { title: string; content: string }) => {
        const messages = JSON.parse(localStorage.getItem('userMessages') || '{}');
        messages[userId] = messages[userId] || [];
        messages[userId].push(message);
        localStorage.setItem('userMessages', JSON.stringify(messages));
    },
    setShowModal: (showModal: boolean) => set({ showModal }),
    setModalUser: (modalUser: ModalUser | null) => set({ modalUser }),
}));
