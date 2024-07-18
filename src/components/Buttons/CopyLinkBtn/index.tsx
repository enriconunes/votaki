import { MdOutlineContentCopy } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CopyLinkBtn() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText("http://localhost:3000").then(() => {
            setCopied(true);
            toast.success("Link copiado para a área de transferência!");
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            toast.error("Falha ao copiar o link.");
        });
    };

    return (
        <button
            onClick={copyToClipboard}
            className="flex items-center w-full mx-4 text-gray-500 font-medium py-2 px-4 rounded-lg hover:text-gray-600 hover:scale-110 duration-300 text-sm md:text-base"
        >
            Copiar link para compartilhamento
            <MdOutlineContentCopy className="ml-2" />
        </button>
    );
}
