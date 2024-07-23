"use client";
import api from "@/services/axiosConfig";
import { useEffect, useState } from "react";

type CityProps = {
    idCity: string,
    name: string
}

interface SelectCityProps {
    handleSelectCity: (idCity: string) => void
}

export default function SelectCity({ handleSelectCity }: SelectCityProps) {

    const [cities, setCities] = useState<CityProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState<string>("");

    async function getCities() {
        const response = await api.get('/api/city');
        const responseData = response.data.cities as CityProps[];
        setCities(responseData);
        setIsLoading(false);
    }

    useEffect(() => {
        getCities();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCity(value);
        handleSelectCity(value);
    }

    return (
        <div className="relative w-full">
            <select
                className="rounded-md w-full p-3 text-white bg-teal-900 focus:border-gray-300 focus:outline-none font-medium"
                value={selectedCity}
                onChange={handleChange}
            >
                <option value="" disabled hidden>Selecione a cidade</option>
                {cities.map((city) => (
                    <option key={city.idCity} value={city.idCity}>{city.name}</option>
                ))}
            </select>
            <div className={`${isLoading ? 'absolute' : 'hidden'} inset-0 bg-gray-900 rounded-md flex items-center justify-center`}>
                <div className="loader text-gray-100 font-medium">Carregando...</div>
            </div>
        </div>
    );
}
