export const isPublic = (path: string) => {
    const publicPaths = ['/login', '/inicio-sesion'];
    return publicPaths.includes(path) && !path.startsWith('/dashboard');
};