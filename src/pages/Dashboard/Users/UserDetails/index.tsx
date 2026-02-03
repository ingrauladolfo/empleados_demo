import { useLayoutEffect, useState, useRef, useEffect, type FC } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Card, Modal } from '@/common/components';
import { useUserDetailsStore } from '@/common/stores';
import { FaChevronLeft, FaUser } from 'react-icons/fa6';
import { useTheme } from '@/common/context';

export const DashboardUserDetails: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user, loading, getUser, resetUser, messages, getMessages, formatMessagesDate, formatDate, getGenderLabel, getCountryName, getFullAddress, handleCopyCoordinates, formatTimePeriod } = useUserDetailsStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyMessage, setCopyMessage] = useState('');
    const resolveId = (): string | null => { const sp = new URLSearchParams(location.search); return sp.get('id'); };
    const id = resolveId();
    useLayoutEffect(() => { if (id) { getUser(id); getMessages(id); } }, [id, getUser, getMessages]);
    useLayoutEffect(() => { return () => { resetUser(); }; }, [resetUser]);
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!menuRef.current) { return; }
            if (!(e.target instanceof Node)) { return; }
            if (!menuRef.current.contains(e.target)) { setMenuOpen(false); }
        };
        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
        const onScroll = () => setMenuOpen(false);
        window.addEventListener('click', onDocClick);
        window.addEventListener('keydown', onEsc);
        window.addEventListener('scroll', onScroll, true);
        return () => {
            window.removeEventListener('click', onDocClick);
            window.removeEventListener('keydown', onEsc);
            window.removeEventListener('scroll', onScroll, true);
        };
    }, []);
    const formatCoordinates = (loc?: any) => {
        const lat = loc?.coordinates?.latitude ?? '';
        const lon = loc?.coordinates?.longitude ?? '';
        const nLat = String(lat).replace(/[^\d\.\-]/g, '');
        const nLon = String(lon).replace(/[^\d\.\-]/g, '');
        return `${nLat}, ${nLon}`;
    };

    const onAddressContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        setMenuOpen(true);
    };

    const onCopyClick = async () => {
        const coords = formatCoordinates(user?.location);
        const ok = await handleCopyCoordinates(coords);
        if (ok) { setCopyMessage('Copiado en el portapapeles'); } else { setCopyMessage('No se pudo copiar las coordenadas'); }
        setMenuOpen(false);
        setShowCopyModal(true);
    };

    if (!id) { return <div className="error-message">No se encontró el ID del usuario</div>; }
    if (loading) { return <div className="loading-message">Cargando usuario...</div>; }
    if (!user) { return <div className="error-message">No se encontró el usuario con id: <strong>{id}</strong></div>; }

    return (
        <div className={`flex flex-wrap gap-6 items-start justify-center w-full box-border [@max-width:980px]:flex-col [@max-width:980px]:gap-4 user-details-grid ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]' : 'bg-[#C6EBCA] text-[#030712]'}`}>
            {/* Header centered */}
            <div className="flex items-center justify-center w-full text-center mb-5 gap-2.5">
                <FaUser className="text-[24px]" />
                <h1 className="text-[24px] m-0">Detalle de {user?.name?.title} {user?.name?.first} {user?.name?.last}</h1>
            </div>
            {/* Left: detalle */}
            <div className=" flex-[1 1 0] max-w-140 min-w-70 [@max-width:980px]:max-w-full [@max-width:980px]:min-w-0">
                <Card type="detail" className='w-full' data={user}>
                    <p>Género: {getGenderLabel(user?.gender)}</p>
                    <p>Fecha: {formatDate(user?.dob?.date)}</p>
                    <p>Edad: {formatTimePeriod(user?.dob?.age)}</p>
                    <p>Nacionalidad: {getCountryName(user.nat)}</p>
                    <p>Email: {user?.email}</p>
                    <p>Teléfono: {user?.phone}</p>
                    <p>Celular: {user?.cell}</p>
                    <p>Dirección:<span onContextMenu={onAddressContextMenu} title="Click derecho para ver opciones" aria-label="Dirección del usuario"> {getFullAddress(user?.location)}</span></p>
                    <p>Fidelidad: {formatTimePeriod(user?.registered?.age)}</p>
                    <p>Miembro desde: {formatDate(user?.registered?.date)} </p>
                </Card>
            </div>
            {/* Right: historial de mensajes (si existen) */}
            {messages && messages.length > 0 && (
                <div className="flex-[1 1 0] max-w-140 min-w-70 [@max-width:980px]:max-w-full [@max-width:980px]:min-w-0">
                    <Card type="detail" data={user} title={`Historial de mensajes con ${user.name?.title ?? ''} ${user.name?.first ?? ''} ${user.name?.last ?? ''}`}>
                        <div className="flex flex-col gap-3 pt-2 max-h-110 overflow-auto [@max-width:980px]:max-h-80">
                            {messages.map((m: any, idx: number) => (
                                <div className="message-item" key={idx}>
                                    <div className="message-title">{m.title}</div>
                                    <div className="message-content">{m.content}</div>
                                    <div className="message-date">{formatMessagesDate(m.date)}</div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* button row */}
            <div className="basis-full order-99 flex justify-center items-center mt-5 box-border [@max-width:980px]:order-99 [@max-width:980px]:basis-full">
                <Button type="button" rounded='rounded-full' className={`${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712]' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]'} py-2.5 px-5 border-none cursor-pointer w-fit!`} onClick={() => navigate(-1)}                >
                    <FaChevronLeft /> Regresar
                </Button>
            </div>
            {/* custom context menu */}
            {menuOpen && (
                <div ref={menuRef} className="custom-context-menu" style={{ left: menuPos.x, top: menuPos.y }} role="menu">
                    <div className="coords-value" onClick={onCopyClick}>
                        {formatCoordinates(user?.location)}
                    </div>
                </div>
            )}

            {/* modal feedback after copy */}
            {showCopyModal && (<Modal message={copyMessage} onClose={() => setShowCopyModal(false)} onConfirm={() => setShowCopyModal(false)} confirmText="Aceptar" />)}
        </div>
    );
};
