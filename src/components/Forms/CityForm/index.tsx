// components/CityForm.tsx
'use client';

import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/services/axiosConfig";

type City = {
  idCity: string;
  name: string;
};

type CityFormProps = {
  cities: City[];
};

export default function CityForm({ cities }: CityFormProps) {
  const [name, setName] = useState("");
  const [activeCollapse, setActiveCollapse] = useState(false);

  const toggleCollapse = () => {
    setActiveCollapse(prev => !prev);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/api/city', {
        name,
      });
      toast.success("Cidade cadastrada com sucesso!");
      // Reset form
      setName("");
    } catch (error) {
      toast.error("Erro ao cadastrar cidade: " + error);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Cidades</h2>

      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 gap-3 bg-red-50"
        onClick={toggleCollapse}
      >
        <span className="font-medium">Cadastrar nova cidade</span>
        <svg
          className={`w-3 h-3 ${activeCollapse ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5L5 1 1 5"
          />
        </svg>
      </button>
      <div className={`${activeCollapse ? 'block' : 'hidden'} p-4 mt-4 border`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Nome:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="text-right">
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 w-full">Cadastrar</button>
          </div>
        </form>
      </div>

      <ul className="mt-3">
        {cities.map(city => (
          <li key={city.idCity} className="flex items-center border justify-between py-4 px-5 font-medium text-gray-500">
            <span>{city.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
