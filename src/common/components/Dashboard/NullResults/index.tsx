// NoResultsFound.tsx

import { useLanguage } from "@/common/context";
import type { NullResultsFoundProps } from "@/common/interfaces";

export const NullResults = ({ text, module }: NullResultsFoundProps) => {

    const { lang } = useLanguage();
    const t = {
        es: text ? `No encontramos ${text} en el módulo: ${module}` : `No hay datos en el módulo: ${module}`,
        en: text ? `${text} was not found in the module: ${module}` : `No data in the module: ${module}`,
    };
    return (
        <div className="text-center py-8">
            {t[lang]}
        </div>
    );
};
