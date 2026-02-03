// icons.ts
import type { JSX } from 'react';
import { FaHome } from 'react-icons/fa';
import { FaBriefcase, FaUsers, FaUserTie } from 'react-icons/fa6';
export const generalIcons: Record<string, JSX.Element> = {
    Inicio: <FaHome />,
    Usuarios: <FaUsers />,
    Home: <FaHome />,
    Users: <FaUsers />,
    Puestos: <FaBriefcase />,
    Roles: <FaBriefcase />,
    Personal: <FaUserTie />,
    Personnel: <FaUserTie />,
};