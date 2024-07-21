// pages/admin.tsx
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
import CandidateForm from "@/components/Forms/CandidateForm";
import CityForm from "@/components/Forms/CityForm";

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
      toast.error("Erro ao buscar dados: " + error);
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

        <div className="py-8 px-4 md:px-8 mb-4 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
          <CandidateForm candidates={candidates} cities={cities} parties={parties} positions={positions} />
        </div>

        <div className="py-8 px-4 md:px-8 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
          <CityForm cities={cities} />
        </div>
      </div>
    </div>
  );
}
