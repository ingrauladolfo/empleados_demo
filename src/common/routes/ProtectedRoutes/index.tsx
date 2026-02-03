import { Loading } from "@/common/components";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLanguage } from "@/common/context";

export const ProtectedRoutes = ({ children, authorized, setShowModal, setUnauthorizedPath }: { children: ReactNode, authorized: boolean, setShowModal: (show: boolean) => void, setUnauthorizedPath: (path: string) => void }) => {
    const { pathname } = useLocation()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            if (!authorized) {
                setUnauthorizedPath(pathname);
                setShowModal(true);
                navigate(lang === 'es' ? "/inicio-sesion" : "/login", { replace: true });
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [authorized, navigate, pathname, setShowModal, setUnauthorizedPath, lang]);

    if (loading) { return <Loading />; }

    return authorized ? children : null;
}