import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface FilterProps {
    candidateNumber: string;
    handleSetCandidateNumber: (number: string) => void;
    getData: () => void;
}

export default function CandidateFilterNumber({ candidateNumber, handleSetCandidateNumber, getData }: FilterProps) {

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const handleNumberClick = (number: string) => {
        if (candidateNumber.length < 5) {
            handleSetCandidateNumber(candidateNumber + number);
        } else {
            toast.warning("Você não pode digitar mais do que 5 números.")
        }
    };

    const handleConfirm = () => {
        if(!candidateNumber){
            toast.warning("Digite um número para pesquisar pelo candidato.")
            return
        }
        setKeyboardVisible(false);
        getData()
    };

    const handleClear = () => {
        handleSetCandidateNumber('');
    };


    const handleCancel = () => {
        handleSetCandidateNumber('');
        setKeyboardVisible(false);
    };

    const handleInputFocus = () => {
        setKeyboardVisible(true);
    };

    return (
        <div className="w-full flex flex-col mt-3">
            <div
                onClick={handleInputFocus}
                className="border-2 border-teal-900 bg-gray-900 py-1 px-2 rounded-md text-gray-200 cursor-pointer"
            >
                {candidateNumber || 'Buscar pelo número do candidato'}
            </div>

            {isKeyboardVisible && (
                <form className="border-2 border-teal-900 bg-gray-900 mt-2 py-2 px-4 rounded-md">
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                type="button"
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                className="bg-black text-white py-2 rounded"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="col-span-1"></div>
                        <button
                            type="button"
                            onClick={() => handleNumberClick('0')}
                            className="bg-black text-white py-2 rounded col-span-1"
                        >
                            0
                        </button>
                        <div className="col-span-1"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-gray-300 text-black py-2 rounded"
                        >
                            LIMPAR
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-orange-500 text-white py-2 rounded"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="bg-green-500 text-white py-2 rounded"
                        >
                            CONFIRMAR
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
