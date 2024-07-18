"use client"

import { signOut } from "next-auth/react"

export default function LogoutBtn(){

    return(
        <button
        className={`bg-red-700 flex justify-center items-center gap-x-3 py-2 px-3 rounded-md text-white hover:cursor-pointer font-medium hover:brightness-90 absolute top-0 right-0 z-50 m-4 text-xs`}
        onClick={() => {signOut()}}>
            <div>
                Sair da sua conta
            </div>
        </button>
    )

}