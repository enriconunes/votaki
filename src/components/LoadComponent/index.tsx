import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadComponent(){

    return(
        <div
        className="flex justify-center items-center text-white">
            <AiOutlineLoading3Quarters
            className="animate-spin"
            size={50}/>
        </div>
    )

}