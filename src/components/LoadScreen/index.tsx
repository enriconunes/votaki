import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadScreen(){

    return(
        <div
        className="h-screen w-full bg-red-600 flex justify-center items-center text-white">
            <AiOutlineLoading3Quarters
            className="animate-spin"
            size={50}/>
        </div>
    )

}