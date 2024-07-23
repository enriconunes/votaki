'use client';

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify"
import LogoutBtn from "@/components/Buttons/LogoutBtn";
import SelectCity from "@/components/Forms/SelectCity";
import LoadScreen from "@/components/LoadScreen";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IoIosLock } from "react-icons/io";


export default function Votar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LoadScreen />
  }

  function handleRedirect(idCity: string) {
    if(idCity == ''){
        toast.warning("Selecione uma cidade para avançar.")
        return
    }
    router.push(`/votar/candidato/${idCity}`);
  }

  function handleSelectCity(idCity: string) {
    setSelectedCity(idCity);
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      <LogoutBtn />

      {(session && session.user.role === 'admin') && (
        <button
        className={`bg-gray-900 flex justify-center items-center gap-x-3 py-2 px-3 rounded-md text-white hover:cursor-pointer font-medium hover:brightness-90 absolute top-0 left-0 z-50 m-4 text-xs`}
        onClick={ () => router.push(`/dashboard`)}
        >
            <div className="flex items-center gap-x-1">
                <IoIosLock className="-mt-1" size={15}/>
                <span>Administrar sistema</span>
            </div>
        </button>
      )}

      <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mb-6" />

      <div className="p-4 w-full sm:max-w-md">
        <div className="p-8 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">
          <div className="flex flex-col items-center">
            <p className="text-center text-base font-bold text-gray-400 mb-4">
              Selecione a cidade da votação para visualizar os candidatos.
            </p>

            <SelectCity handleSelectCity={handleSelectCity} />
          </div>
        </div>
      </div>

      <div>
        <p
          className="font-medium text-white mt-2 hover:brightness-125 hover:cursor-pointer text-lg border-b"
          onClick={() => handleRedirect(selectedCity)}
        >
          Avançar
        </p>
      </div>
    </div>
  );
}
