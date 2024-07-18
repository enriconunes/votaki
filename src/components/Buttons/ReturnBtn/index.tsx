import { IoReturnDownBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface ReturnBtnProps {
    endpoint: string;
}

export default function ReturnBtn({endpoint}: ReturnBtnProps){

    const router = useRouter();

    function handleRedirect(endpoint: string){
        router.push(endpoint);
    }

    return(
        <button
        className={`bg-red-700 flex justify-center items-center gap-x-3 py-2 px-3 rounded-md text-white hover:cursor-pointer font-medium hover:brightness-90 absolute top-0 left-0 z-50 m-4 text-xs`}
        onClick={() => handleRedirect(endpoint)}
        >
            <div>
                <IoReturnDownBackSharp />
            </div>
        </button>
    )

}