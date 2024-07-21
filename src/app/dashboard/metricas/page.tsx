"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LogoutBtn from "@/components/Buttons/LogoutBtn";
import LoadScreen from "@/components/LoadScreen";
import api from "@/services/axiosConfig";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ReturnBtn from "@/components/Buttons/ReturnBtn";

ChartJS.register(ArcElement, Tooltip, Legend);

type City = {
  idCity: string;
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
  city: City;
  createdAt: string;
  updatedAt: string;
  Position: Position;
  voteCount: number;
}

type ApiResponse = {
  candidatesWithVoteCount: CandidateProps[];
  status: number;
  message: string;
};

export default function MetricsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [cities, setCities] = useState<City[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("be15e03e-67ea-4124-b318-370ccb1d795a");
  const [selectedPosition, setSelectedPosition] = useState<string>("4b1551c8-4913-446e-a916-d2ebc55d2b97");

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
      fetchFilters();
    }
  }, [session, status, router, selectedCity, selectedPosition]);

  async function fetchData() {
    try {
        const response = await api.get<ApiResponse>(`/api/vote?idCity=${selectedCity}&idPosition=${selectedPosition}`);
        const candidatesWithVoteCount = response.data.candidatesWithVoteCount;

        if(response.data.status !== 200){
        return toast.error(response.data.message)
        }

        const totalVotes = candidatesWithVoteCount.reduce((sum: number, candidate: CandidateProps) => sum + candidate.voteCount, 0);

        setCandidates(candidatesWithVoteCount);
        setTotalVotes(totalVotes);
    } catch (error) {
        toast.error("Erro ao buscar dados: " + error);
    } finally {
        setIsLoading(false);
    }
  }

  async function fetchFilters() {
    try {
        const [citiesResponse, positionsResponse] = await Promise.all([
        api.get('/api/city'),
        api.get('/api/position')
        ]);

        setCities(citiesResponse.data.cities);
        setPositions(positionsResponse.data.positions);
    } catch (error) {
        toast.error("Erro ao buscar dados dos filtros");
    } finally {
        setIsLoading(false);
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    setSelectedCity(e.target.value);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    setSelectedPosition(e.target.value);
  };

  const pieData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Votos',
        data: candidates.map(candidate => candidate.voteCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (status === 'loading') {
    return <LoadScreen />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-600">
      <LogoutBtn />
      <ReturnBtn endpoint={'/dashboard'}/>
      <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mb-6 mt-16" />
      <div className="p-4 w-full sm:max-w-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="loader text-gray-100 font-medium">Carregando pesquisa...</div>
          </div>
        )}
        <h1 className="text-center text-base font-bold text-white mb-4">
          Métricas para {"candidates[0]?.city.name"}
        </h1>
        <div className="mb-4">
          <label htmlFor="city" className="block text-white mb-2">Cidade:</label>
          <select id="city" value={selectedCity} onChange={handleCityChange} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="" disabled hidden>Selecione a cidade</option>
            {cities.map(city => (
              <option key={city.idCity} value={city.idCity}>{city.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="position" className="block text-white mb-2">Posição:</label>
          <select id="position" value={selectedPosition} onChange={handlePositionChange} className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500">
            <option value="" disabled hidden>Selecione a posição</option>
            {positions.map(position => (
              <option key={position.idPosition} value={position.idPosition}>{position.name}</option>
            ))}
          </select>
        </div>
        <h2 className="text-center text-xl font-semibold mb-4 text-white">Total de votos: {totalVotes}</h2>
        <div className="w-full flex justify-center mb-6 bg-gray-100 py-3 rounded-md mt-4">
          <div className="w-full sm:w-2/3">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="w-full space-y-4">
          {candidates.map(candidate => (
            <div key={candidate.idCandidate} className="bg-gray-100 p-4 rounded shadow">
              <div className="flex items-center space-x-4">
                <img src={candidate.image} alt={candidate.name} className="w-16 h-16 object-cover rounded-full" />
                <div>
                  <h3 className="text-lg font-bold">{candidate.name}</h3>
                  <p>Votos recebidos: {candidate.voteCount}</p>
                  <p>Porcentagem total: {((candidate.voteCount / totalVotes) * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
