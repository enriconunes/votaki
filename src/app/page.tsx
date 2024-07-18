"use client"

import LoginBtn from "@/components/Buttons/LoginBtn";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-red-600">
        <img src={"/LogoWhite.png"} alt="Votaki Logo" className="sm:w-2/6 w-2/3 mb-6" />
        <div className="p-4 w-full sm:max-w-md">
            <div className="max-w-md w-full p-8 bg-white border-2 border-gray-200 rounded-lg shadow-2xl">

                <div className="flex flex-col items-center">
                  <LoginBtn />
                </div>

                <p
                className="text-center text-base mt-3 font-bold text-gray-400">
                  Entre com a sua conta do Google para iniciar a votação.
                </p>
            </div>
        </div>
    </div>
  );
}
