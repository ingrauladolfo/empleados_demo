// src/utils/classes.ts
export const getThemeLoadingClasses = (theme: 'light' | 'dark') => {
    const textLoading = theme === "light" ? 'text-gray-950' : 'text-gray-100'
    const spinnerLoading = theme === 'light' ? 'border-gray-950 border-t-red-600' : 'border-gray-100 border-t-amber-300'
    return { textLoading, spinnerLoading };
};
