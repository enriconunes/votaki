"use client";
import api from "@/services/axiosConfig";
import { useEffect, useState } from "react";

type PositionProps = {
    idPosition: string,
    name: string
}

interface SelectPositionProps {
    handleSelectPosition: (idCity: string) => void
}

export default function SelectPosition({ handleSelectPosition }: SelectPositionProps) {

    const [positions, setPositions] = useState<PositionProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState<string>("");

    async function getPositions() {
        const response = await api.get('/api/position');
        const responseData = response.data.positions as PositionProps[];
        setPositions(responseData);
        setIsLoading(false);
    }

    useEffect(() => {
        getPositions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedPosition(value);
        handleSelectPosition(value);
    }

    return (
        <div className="relative w-full">
            <select
                className="rounded-md w-full p-3 text-white bg-teal-900 focus:border-gray-300 focus:outline-none font-medium"
                value={selectedPosition}
                onChange={handleChange}
            >
                <option value="" disabled hidden>Selecionar cargo</option>
                {positions.map((position) => (
                    <option key={position.idPosition} value={position.idPosition}>{position.name}</option>
                ))}
            </select>
            <div className={`${isLoading ? 'absolute' : 'hidden'} inset-0 bg-gray-900 rounded-md flex items-center justify-center`}>
                <div className="loader text-gray-100 font-medium">Carregando...</div>
            </div>
        </div>
    );
}
