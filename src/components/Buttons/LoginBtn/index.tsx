"use client"

// login function from next-auth
import { signIn } from "next-auth/react";

// icons
import { FaGoogle } from "react-icons/fa";

export default function LoginBtn(){

    return(

        <button
        className="bg-red-600 w-full flex justify-center items-center gap-x-3 px-3 py-2 rounded-md text-white hover:cursor-pointer font-medium hover:brightness-90"
        onClick={(e) => {
          e.preventDefault()
          signIn('google', {
            callbackUrl: '/votar/cidade',
          })
        }}>
            <FaGoogle />
            <div>
                Continuar com o Google
            </div>
        </button>

    )

}