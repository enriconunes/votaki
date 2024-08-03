'use client';

import { toast } from "react-toastify";
import LogoutBtn from "@/components/Buttons/LogoutBtn";
import SelectCity from "@/components/Forms/SelectCity";
import LoadScreen from "@/components/LoadScreen";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";
import { useLocation } from "@/context/LocationContext";
import SelectPosition from "@/components/Forms/SelectPosition";

export default function Votar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { coordinates, setCoordinates, locationError } = useLocation(); // Incluído locationError do contexto
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (!coordinates && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords); // Atualiza o contexto com as novas coordenadas
        },
        (error) => {
          // Se o erro já estiver no contexto, não há necessidade de setá-lo novamente
          if (!locationError) {
            setCoordinates(null); // Limpa as coordenadas no caso de erro
            console.log(`Sem informações da geolocalização: ${error.message}`);
          }
        }
      );
    } else if (!navigator.geolocation) {
      setCoordinates(null); // Limpa as coordenadas se a geolocalização não for suportada
      console.log('Geolocalização não é suportada neste navegador.');
    }
  }, [coordinates, setCoordinates, locationError]);

  if (status === 'loading') {
    return <LoadScreen />;
  }

  function handleRedirect(idCity: string, idPosition: string) {
    if (idCity === '') {
      toast.warning("Selecione a sua cidade de votação para avançar.");
      return;
    }
    if (idPosition === '') {
      toast.warning("Selecione o cargo do(a) candidato(a) que você deseja votar para avançar.");
      return;
    }
    router.push(`/votar/candidato?idCity=${idCity}&idPosition=${idPosition}`);
  }

  function handleSelectCity(idCity: string) {
    setSelectedCity(idCity);
  }

  function handleSelectPosition(idPosition: string) {
    setSelectedPosition(idPosition);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      <LogoutBtn />

      {(session && session.user.role === 'admin') && (
        <button
          className="bg-gray-900 flex justify-center items-center gap-x-3 py-2 px-3 rounded-md text-white hover:cursor-pointer font-medium hover:brightness-90 absolute top-0 left-0 z-50 m-4 text-xs"
          onClick={() => router.push(`/dashboard`)}
        >
          <div className="flex items-center gap-x-1">
            <IoIosLock className="-mt-1" size={15} />
            <span>Administrar sistema</span>
          </div>
        </button>
      )}

      <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mb-6" />

      <div className="p-4 w-full sm:max-w-md">
        <div className="p-8 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
          <div className="flex flex-col items-center">

            <p className="text-center text-sm md:text-base font-bold text-gray-400 mb-4">
              Selecione a cidade da votação.
            </p>
            <SelectCity handleSelectCity={handleSelectCity} />

            <p className="text-center text-sm md:text-base font-bold text-gray-400 my-4">
              Selecione o cargo do(a) candidato(a).
            </p>
            <SelectPosition handleSelectPosition={handleSelectPosition} />

          </div>
        </div>
      </div>

      <div>
        <p
          className="font-medium text-white mt-2 hover:brightness-125 hover:cursor-pointer text-lg border-b"
          onClick={() => handleRedirect(selectedCity, selectedPosition)}
        >
          Avançar
        </p>
      </div>
    </div>
  );
}
