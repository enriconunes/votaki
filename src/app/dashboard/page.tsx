'use client';

import { toast } from "react-toastify";
import LogoutBtn from "@/components/Buttons/LogoutBtn";
import LoadScreen from "@/components/LoadScreen";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/services/axiosConfig";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ReturnBtn from "@/components/Buttons/ReturnBtn";

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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollapse, setActiveCollapse] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status, router]);

  async function fetchData() {
    try {
      const [candidatesResponse, partiesResponse, citiesResponse, positionsResponse] = await Promise.all([
        api.get('/api/candidate'),
        api.get('/api/party'),
        api.get('/api/city'),
        api.get('/api/position')
      ]);

      setCandidates(candidatesResponse.data.candidates);
      setParties(partiesResponse.data.party);
      setCities(citiesResponse.data.cities);
      setPositions(positionsResponse.data.positions);
    } catch (error) {
      toast.error("Erro ao buscar dados");
    } finally {
      setIsLoading(false);
      console.log(positions)
    }
  }

  const toggleCollapse = (id: string) => {
    setActiveCollapse(prev => (prev === id ? null : id));
  };

  if (status === 'loading' || isLoading) {
    return <LoadScreen />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-600 relative">
      <LogoutBtn />
      <ReturnBtn endpoint={'/votar/cidade'}/>

      <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mb-6 mt-16" />

      <div className="p-4 w-full sm:max-w-2xl">
        <h1 className="text-center text-base font-bold text-white mb-4">
          Seja bem-vindo, {session?.user.name}!
        </h1>

        <button className="bg-red-700 text-white w-full mb-4 py-2 rounded-md md:py-3 font-medium hover:bg-red-800"
        onClick={() => router.push('dashboard/metricas')}>
            Visualizar métricas
        </button>

        <div className="py-8 px-4 md:px-8 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
          <div className="w-full" id="accordion-collapse" data-accordion="collapse">
            <div className="mb-4">
              <button
                type="button"
                className="w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => toggleCollapse("new-candidate")}
              >
                Cadastrar novo candidato
              </button>
              <div className={`${activeCollapse === "new-candidate" ? 'block' : 'hidden'} p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900`}>
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">Nome:</label>
                    <input type="text" id="name" name="name" className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700">Descrição:</label>
                    <textarea id="description" name="description" className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="position" className="block text-gray-700">Posição:</label>
                    <select id="position" name="position" className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500">
                      {positions?.map(position => (
                        <option key={position.idPosition} value={position.idPosition}>{position.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="party" className="block text-gray-700">Partido:</label>
                    <select id="party" name="party" className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500">
                      {parties?.map(party => (
                        <option key={party.idParty} value={party.idParty}>{party.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700">Cidade:</label>
                    <select id="city" name="city" className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500">
                      {cities?.map(city => (
                        <option key={city.idCity} value={city.idCity}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-right">
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 w-full">Cadastrar</button>
                  </div>
                </form>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Candidatos</h2>
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
        </div>
      </div>
    </div>
  );
}
