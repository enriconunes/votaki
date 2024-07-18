import LoginBtn from "@/components/Buttons/LoginBtn"

export default function LoginForm(){

    return(

        <form className="bg-white shadow-md flex flex-col items-center px-4 py-8 w-full">

            {/* logo icon */}
            <div className="text-4xl font-bold text-red-700">
                VOTAKI
            </div>

            {/* text */}
            <span className="mb-4 mt-5 text-red-700 font-medium">
                Faça o login para efetuar o seu voto
            </span>

            <LoginBtn/>
            
        </form>

    )

}