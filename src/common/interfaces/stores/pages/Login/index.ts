export interface UserLogin {
    login: {
        username: string;
        password: string;
    };
}
export interface StoreLogin {
    hasFetched: any;
    users: UserLogin[];
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    fetchUsers: () => Promise<void>;
    login: () => Promise<boolean>;
    isAuthenticated: boolean;
    showModal: boolean;
    modalMessage: string;
    handleSubmit: (e: any) => void;
    handleLogin: (navigate: any) => Promise<void>;
    handleCloseModal: () => void;
    checkAuth: () => void;

}
