// components/CandidateForm.tsx
'use client';

import { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "@/services/axiosConfig";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [party, setParty] = useState("");
  const [city, setCity] = useState("");
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setActiveCollapse(prev => (prev === id ? null : id));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/api/candidate', {
        name,
        description,
        idPosition: position,
        idParty: party,
        idCity: city,
      });
      toast.success("Candidato cadastrado com sucesso!");
      // Reset form
      setName("");
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
        className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 gap-3 mb-3 bg-teal-50"
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
      {candidates.map(candidate => (
        <div key={candidate.idCandidate}>
          <button
            type="button"
            className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 gap-3"
            onClick={() => toggleCollapse(candidate.idCandidate)}
          >
            <div className="flex items-center gap-3">
              <img src={candidate.image} alt={candidate.name} className="w-12 h-12 object-cover rounded-full" />
              <span>{candidate.name}</span>
            </div>
            <svg
              className={`w-3 h-3 ${activeCollapse === candidate.idCandidate ? 'rotate-180' : ''}`}
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
          <div
            className={`${activeCollapse === candidate.idCandidate ? 'block' : 'hidden'} p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900`}
          >
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Descrição:</strong> {candidate.description}</p>
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Posição:</strong> {candidate.Position.name}</p>
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Partido:</strong> {candidate.Party.name}</p>
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Cidade:</strong> {candidate.City.name}</p>
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Criado em:</strong> {new Date(candidate.createdAt).toLocaleString()}</p>
            <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Atualizado em:</strong> {new Date(candidate.updatedAt).toLocaleString()}</p>
            <div className="flex justify-end gap-2">
              <FaEdit size={24} className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
              <MdDelete size={24} className="text-red-500 hover:text-red-700 cursor-pointer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
