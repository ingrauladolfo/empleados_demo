import type { FormUtils } from "@/common/interfaces/stores";
import {create} from "zustand";
export const useFormUtilsStore = create<FormUtils>(() => {
    const parseToISO = (raw: string): string | null => {
        if (!raw) return null;
        const ymd = /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/;
        const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (ymd.test(raw)) {
            const [, y, m, d] = raw.match(ymd)!;
            return `${y}-${m}-${d}`;
        }
        if (dmy.test(raw)) {
            const [, d, m, y] = raw.match(dmy)!;
            return `${y}-${m}-${d}`;
        }
        return null;
    };

    const isoToDisplay = (iso: string | null): string => {
        if (!iso) return "";
        const [, y, m, d] = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/) ?? [];
        return y ? `${d}/${m}/${y}` : "";
    };

    const isoToSlashSend = (iso: string | null): string =>
        iso ? iso.replace(/-/g, "/") : "";

    const calcAgeFromISO = (iso: string | null): number | undefined => {
        if (!iso) return undefined;
        const [y, m, d] = iso.split("-").map(Number);
        const dob = new Date(y, m - 1, d);
        const now = new Date();
        let age = now.getFullYear() - dob.getFullYear();
        const diff = now.getMonth() - dob.getMonth();
        if (diff < 0 || (diff === 0 && now.getDate() < dob.getDate())) age--;
        return age;
    };

    const selector = (s: FormUtils) => ({
        parseToISO: s.parseToISO,
        isoToDisplay: s.isoToDisplay,
        isoToSlashSend: s.isoToSlashSend,
        calcAgeFromISO: s.calcAgeFromISO,
    });

    return {
        parseToISO,
        isoToDisplay,
        isoToSlashSend,
        calcAgeFromISO,
        selector,
    };
});
