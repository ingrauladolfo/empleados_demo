import { Loading, Modal } from "@/common/components";
import { lazy, Suspense, useLayoutEffect, useMemo, useState, type ComponentType, type LazyExoticComponent } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { ProtectedRoutes } from "../ProtectedRoutes";
import { DashboardLayout, Login } from "@/pages";
import { useLanguage } from "@/common/context";
import { pagesMap, pathToTitle } from "@/assets/data";
import { isPublic } from "@/common/functions";
import type { Path } from "@/common/interfaces";
import { useLoginStore } from "@/common/stores";
export const AppRouter = () => {
    const location = useLocation();
    const { pathname, search } = location;
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const { isAuthenticated } = useLoginStore();
    const [showModal, setShowModal] = useState(false);
    const [unauthorizedPath, setUnauthorizedPath] = useState("");
    // keep pathname only for matching (no search)
    const normalizedPath = pathname === '/' ? (lang === 'es' ? '/inicio-sesion' : '/login') : pathname;
    const matchedRoute = useMemo(() => pathToTitle.find(entry => Object.values(entry.path).includes(normalizedPath)), [normalizedPath]);
    const isPublicRoute = useMemo(() => { const entry = pathToTitle.find(p => p.path.en === normalizedPath || p.path.es === normalizedPath); const pathObj: Path = entry ? entry.path : { en: normalizedPath, es: normalizedPath }; return isPublic(pathObj[lang]); }, [normalizedPath, pathToTitle, lang]);
    const isExactMatch = useMemo(() => { const match = pathToTitle.some(entry => Object.values(entry.path).includes(normalizedPath)); return match; }, [normalizedPath]);
    useLayoutEffect(() => { document.title = matchedRoute ? matchedRoute.title[lang] : (lang === 'en' ? 'Error | Page not found' : 'Error | Página no encontrada'); }, [matchedRoute, lang]);

    // If the canonical route for this entry differs by language, navigate to it.
    // Preserve query string (search) so things like ?id=... aren't dropped.
    useLayoutEffect(() => {
        if (!matchedRoute) { return; }
        const newPath = matchedRoute.path[lang];
        if (newPath && normalizedPath !== newPath) { navigate(`${newPath}${search || ""}`, { replace: true }); }
    }, [matchedRoute, lang, normalizedPath, navigate, search]);
    const publicPaths = useMemo(() => {
        const fromMap = Object.keys(pagesMap).filter(p => isPublic(p));
        const fromTitles = pathToTitle.flatMap(({ path }) =>
            [path.en, path.es].filter(p => isPublic(p))
        );
        return Array.from(new Set([...fromMap, ...fromTitles]));
    }, [pagesMap, pathToTitle]);
    const LoaderComponent = useMemo(() => {
        if (!matchedRoute) { return () => 'Página no encontrada'; }
        const loader = pagesMap[matchedRoute.path.en] || pagesMap[matchedRoute.path.es];
        if (!loader) { return () => 'Página en construcción'; }
        return lazy(loader);
    }, [matchedRoute]);

    const lazyMap = useMemo(() => {
        const m: Record<string, LazyExoticComponent<ComponentType<any>>> = {};
        Object.entries(pagesMap).forEach(([p, loader]) => {
            if (isPublic(p)) { m[p] = lazy(loader); }
        });
        pathToTitle.forEach(({ path }) => {
            const { en, es } = path;
            if (isPublic(en) && pagesMap[en]) { m[en] ??= lazy(pagesMap[en]); }
            if (isPublic(es) && pagesMap[es]) { m[es] ??= lazy(pagesMap[es]); }
        });
        return m;
    }, [pagesMap, pathToTitle]);

    return (
        <Routes>
            <Route path={lang === 'es' ? "/inicio-sesion" : "/login"} element={
                <>
                    <Login />
                    {showModal && (<Modal message={lang === 'es' ? `No tienes permiso para acceder a ${unauthorizedPath}` : `You don't have permission to access ${unauthorizedPath}`} onClose={() => setShowModal(false)} onConfirm={() => setShowModal(false)} confirmText="Aceptar" />)}
                </>
            } />

            <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

            {publicPaths.map(p => {
                const Comp = lazyMap[p];
                return (
                    <Route key={p} path={p} element={<Suspense fallback={<Loading />}><Comp /></Suspense>} />
                );
            })}
            {isPublicRoute ? (
                <Route path={normalizedPath} element={<Suspense fallback={<Loading />}>                            <LoaderComponent />                        </Suspense>} />
            ) : (
                <Route path="/dashboard/*" element={
                    <ProtectedRoutes authorized={isAuthenticated && isExactMatch} setShowModal={setShowModal} setUnauthorizedPath={setUnauthorizedPath}                    >
                        <DashboardLayout />
                    </ProtectedRoutes>
                }>
                    <Route path="*" element={<Suspense fallback={<Loading />}><LoaderComponent /></Suspense>} />
                </Route>
            )}

            {/* Global fallback */}
            <Route path="*" element={<Suspense fallback={<Loading />}><LoaderComponent /></Suspense>} />
        </Routes>
    );
};
