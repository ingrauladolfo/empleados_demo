// userDetailsStore.interface.ts
export interface UserMessage {
    title: string;
    content: string;
    date: string; // ISO string
}

export interface UserDetailsStore {
    user: any | undefined;
    loading: boolean;
    userId: string | null;
    messages: UserMessage[];
    getUser: (id: string) => void;
    getMessages: (id: string) => void;
    resetUser: () => void;
    getUserId: () => string | null;
    getUserData: () => any | undefined;
    isLoading: () => boolean;
    formatMessagesDate: (iso?: string) => string;
    formatDate: (iso?: string) => string;
    getGenderLabel: (gender: string) => string;
    getCountryName: (country: string) => any;
    getFullAddress: (location: any) => string;
    handleCopyCoordinates: (coords: string) => Promise<boolean>;
    formatTimePeriod: (years: number) => string;

}