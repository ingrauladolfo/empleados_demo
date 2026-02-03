export const normalize = (p: string) => {
    if (!p) { return '/'; }
    return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
};