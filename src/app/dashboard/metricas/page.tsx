'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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
  createdAt: string;
  updatedAt: string;
  Position: Position;
  voteCount: number;
}

type ApiResponse = {
  candidatesWithVoteCount: CandidateProps[];
};

export default function MetricsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { idCity } = useParams();

  const [candidates, setCandidates] = useState<CandidateProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status, router]);

  async function fetchData() {
    try {
      // Endpoint fictício para a apresentação
      const response = await api.get<ApiResponse>(`/api/vote/${idCity}`);
      const candidatesWithVoteCount = response.data.candidatesWithVoteCount;

      const totalVotes = candidatesWithVoteCount.reduce((sum: number, candidate: CandidateProps) => sum + candidate.voteCount, 0);

      setCandidates(candidatesWithVoteCount);
      setTotalVotes(totalVotes);
    } catch (error) {
      toast.error("Erro ao buscar dados");
    } finally {
      setIsLoading(false);
    }
  }

  if (status === 'loading' || isLoading) {
    return <LoadScreen />;
  }

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-red-600">
      <LogoutBtn />
      <ReturnBtn endpoint={'/dashboard'}/>
      <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mb-6 mt-16" />
      <div className="p-4 w-full sm:max-w-2xl">
        <h1 className="text-center text-xl font-bold mb-4 text-white">Métricas em Vitória da Conquista</h1>
        <h2 className="text-center text-xl font-semibold mb-4 text-white">Total de votos: {totalVotes}</h2>
        <div className="w-full flex justify-center mb-6 bg-gray-100 py-3 rounded-md">
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
