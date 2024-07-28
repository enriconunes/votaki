// components/CandidateForm.tsx
'use client';

import { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "@/services/axiosConfig";
import CandidatesListing from "@/components/Listing/CandidatesListing";

type City = {
  idCity: string;
  name: string;
}

type Party = {
  idParty: string;
  name: string;
}

type Position = {
  idPosition: string;
  name: string;
}

type CandidateProps = {
  idCandidate: string;
  name: string;
  description: string;
  number: string;
  image: string;
  idPosition: string;
  idParty: string;
  idCity: string;
  createdAt: Date;
  updatedAt: Date;
  City: City;
  Party: Party;
  Position: Position;
};

type CandidateFormProps = {
  cities: City[];
  parties: Party[];
  positions: Position[];
  candidates: CandidateProps[];
};

export default function CandidateForm({ cities, parties, positions, candidates }: CandidateFormProps) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(positions.length > 0 ? positions[0].idPosition : "");
  const [party, setParty] = useState(parties.length > 0 ? parties[0].idParty : "");
  const [city, setCity] = useState(cities.length > 0 ? cities[0].idCity : "");
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setActiveCollapse(prev => (prev === id ? null : id));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if(!name || !description || !position || !party || !city || !number){
      toast.error("Preencha todos os campos para cadastrar um novo candidato.");
      return
    }

    try {
      await api.post('/api/candidate', {
        name,
        description,
        number,
        idPosition: position,
        idParty: party,
        idCity: city,
      });

      toast.success("Candidato cadastrado com sucesso!");

      // Reset form
      setName("");
      setNumber("");
      setDescription("");
      setPosition("");
      setParty("");
      setCity("");
    } catch (error) {
      toast.error("Erro ao cadastrar candidato: " + error);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Candidatos</h2>

      {/* Button to toggle form collapse */}
      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 gap-3 mb-3 bg-teal-50"
        onClick={() => toggleCollapse("form")}
      >
        <span>Cadastrar novo candidato</span>
        <svg
          className={`w-3 h-3 ${activeCollapse === "form" ? 'rotate-180' : ''}`}
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

      {/* Form Collapse */}
      <div
        className={`${activeCollapse === "form" ? 'block' : 'hidden'} p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 mt-4`}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Número:</label>
            <input 
              type="text"
              id="number" 
              name="number" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
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
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Descrição:</label>
            <textarea 
              id="description" 
              name="description" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="position" className="block text-gray-700">Posição:</label>
            <select 
              id="position" 
              name="position" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              {positions.map(position => (
                <option key={position.idPosition} value={position.idPosition}>{position.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="party" className="block text-gray-700">Partido:</label>
            <select 
              id="party" 
              name="party" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={party}
              onChange={(e) => setParty(e.target.value)}
            >
              {parties.map(party => (
                <option key={party.idParty} value={party.idParty}>{party.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700">Cidade:</label>
            <select 
              id="city" 
              name="city" 
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city.idCity} value={city.idCity}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <button type="submit" className="px-4 py-2 bg-teal-900 text-white rounded-md hover:bg-teal-950 w-full">Cadastrar</button>
          </div>
        </form>
      </div>

      {/* Candidates list */}
      <CandidatesListing candidates={candidates} parties={parties} cities={cities} positions={positions}/>

    </div>
  );
}
