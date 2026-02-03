import type { SendMessageModalProps } from "@/common/interfaces";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { Button } from "../../Button";
export const SendMessageModal = ({ user, onClose, onSendMessage }: SendMessageModalProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // delegate to parent
        if (typeof onSendMessage === 'function') { onSendMessage({ title, content }); }
        onClose();
    };
    return (
        <div className="flex justify-center items-center z-1000 p-4 box-border fixed top-0 left-0 size-full bg-[#00000073]">
            <div className="bg-[#d1d1d1] p-5.5 rounded-xl shadow-[0 8px 24px rgba(0, 0, 0, 0.18)] w-full max-w-140 relative box-border [@max-width:480px]:p-4 [@max-width:480px]:rounded-lg [@max-width:480px]:w-full [@max-width:480px]:max-h-screen [@max-width:480px]:h-auto [@max-width:480px]:overflow-auto " role="dialog" aria-modal="true" aria-label={`Enviar mensaje a ${user?.name?.first ?? ''}`}>
                <button className="flex items-center justify-center absolute top-3 right-3 bg-transparent text-[18px] border-none cursor-pointer text-[#333] p-1.5 " onClick={onClose} aria-label="Cerrar" type="button"                >
                    <FaX />
                </button>

                <h2 className="m-[0 0 12px 0] text-[20px] text-[#111827] text-left pr-9  [@max-width:480px]:text-[18px] font-semibold">Enviar mensaje a {user?.name?.first} {user?.name?.last}</h2>

                <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
                    <label className="block text-[13px] text-[#374151] mb-1.5" htmlFor="msg-title">Título</label>
                    <input
                        id="msg-title"
                        className="w-full py-2.5 px-3 border rounded-lg border-[#111827] bg-[#d1d1d1] text-[14px] text-[#111827] box-border outline-none transition-[box-shadow .12s ease, border-color .12s ease] focus:border-[#3b82f6] focus:shadow-[ 0 0 0 4px rgba(59, 130, 246, 0.08)] sendMessage-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Asunto del mensaje"
                        required
                    />

                    <label className="block text-[13px] text-[#374151] mb-1.5" htmlFor="msg-content">Contenido</label>
                    <textarea
                        id="msg-content"
                        className="w-full py-2.5 px-3 border rounded-lg border-[#111827] bg-[#d1d1d1] text-[14px] text-[#111827] box-border outline-none transition-[box-shadow .12s ease, border-color .12s ease] focus:border-[#3b82f6] focus:shadow-[ 0 0 0 4px rgba(59, 130, 246, 0.08)] [@max-width:480px]:min-h-30"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        rows={6}
                        required
                    />

                    <div className="flex gap-2.5 justify-end mt-2">
                        <Button rounded="rounded-lg" type="button" className="bg-[#111827] text-[#d1d1d1] border border-[#E6E9EE] py-2 px-3 cursor-pointer" onClick={onClose}>Cancelar</Button>
                        <Button rounded="rounded-lg" type="submit" className="bg-[#3e8e41] text-[#d1d1d1] border-none py-2.25 px-3.5 cursor-pointer font-semibold hover:filter-[brightness(.95)] btn-primary">Enviar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
