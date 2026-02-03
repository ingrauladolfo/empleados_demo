// src/common/interfaces/index.ts

import type { User } from "@/common/interfaces/stores";
import type { Dispatch, SetStateAction } from "react";

export type ModalUser = Partial<User> & {
    name: User['name'];
    dob: { date: string; age?: number };
};

export type Position = {
    id: string;
    jobTitle: string; // nombre del puesto
    salary: number;
};

export type Personal = ModalUser | Position & {
    user?: ModalUser;
    role?: Position;
};

export type FormType = "usuarios" | "puesto" | "personal";

export type FormProps<T extends FormType> = {
    type: T;
    user?: T extends 'usuarios' ? ModalUser : never;
    setUser?: T extends 'usuarios' ? Dispatch<SetStateAction<ModalUser>> : never;
    job?: T extends 'puesto' ? Position : never;
    setJob?: T extends 'puesto' ? Dispatch<SetStateAction<Position>> : never;
    personal?: T extends 'personal' ? Personal : never;
    setPersonal?: T extends 'personal' ? Dispatch<SetStateAction<Personal>> : never;
};