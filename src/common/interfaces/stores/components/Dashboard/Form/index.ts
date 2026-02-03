export type FormUtils = {
    parseToISO: (raw: string) => string | null;
    isoToDisplay: (iso: string | null) => string;
    isoToSlashSend: (iso: string | null) => string;
    calcAgeFromISO: (iso: string | null) => number | undefined;
    selector: (s: FormUtils) => {
        parseToISO: FormUtils["parseToISO"];
        isoToDisplay: FormUtils["isoToDisplay"];
        isoToSlashSend: FormUtils["isoToSlashSend"];
        calcAgeFromISO: FormUtils["calcAgeFromISO"];
    };
};
