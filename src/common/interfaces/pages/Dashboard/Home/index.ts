// interfaces
export interface UserDashboardHomeProfile {
    name: {
        title: string;
        first: string;
        last: string;
    };
}

export interface DashboardHomeState {
    userProfile: UserDashboardHomeProfile | null;
    buttons: { path: string; title: string }[];
    loadUserProfile: () => void;
    loadButtons: (lang: string) => void;
    getSaludo: (title: string, lang: string) => string;
}