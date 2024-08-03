'use client'

import LogoutBtn from "@/components/Buttons/LogoutBtn";
import LoadScreen from "@/components/LoadScreen";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import api from "@/services/axiosConfig";
import { toast } from "react-toastify";
import LoadComponent from "@/components/LoadComponent";
import ReturnBtn from "@/components/Buttons/ReturnBtn";
import { TbLoader } from "react-icons/tb";
import CopyLinkBtn from "@/components/Buttons/CopyLinkBtn";
import { signOut } from "next-auth/react";
import CandidateFilterNumber from "@/components/Forms/CandidadeFilterNumber";
import { useLocation } from "@/context/LocationContext";
import { useSearchParams } from "next/navigation";

type Party = {
    idParty: string;
    name: string;
}

type Position = {
    idPostion: string;
    name: string;
}

type City = {
    idCity: string;
    name: string;
}

type CandidateProps = {
    idCandidate: string;
    name: string;
    description: string;
    number: string;
    image: string;
    idPosition: string;
    idParty: string;
    idCity: string;
    createdAt: Date;
    updatedAt: Date;
    Party: Party;
    Position: Position
};

export default function Votar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    // const { idCity } = useParams();
    const { coordinates } = useLocation(); // Obtendo coordenadas do contexto

    // url params
    const searchParams = useSearchParams();
    let idCity = searchParams.get("idCity");
    let idPosition = searchParams.get("idPosition");

    const [candidateNumber, setCandidateNumber] = useState('');
    const [candidate, setCandidate] = useState<CandidateProps>();
    const [candidateNotFound, setCandidateNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voteInProgress, setVoteInProgress] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [candidateSelectedId, setCandidateSelectedId] = useState('');
    const [candidateSelectedName, setCandidateSelectedName] = useState('');
    const [selectedCity, setSelectedCity] = useState<City>();
    const [selectedPosition, setSelectedPosition] = useState<Position>();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router, session]);

    async function getCityAndPositionName(){

        // recuperar nome da cidade pelo id passado na url
        const responseCity = await api.get(`/api/city/${idCity}`);
        const responseCityData = responseCity.data.city as City;
        setSelectedCity(responseCityData)

        // recuperar o nome do cargo pelo id passado na url
        const responsePosition = await api.get(`/api/position/${idPosition}`);
        const responsePositionData = responsePosition.data.position as Position;
        setSelectedPosition(responsePositionData)

    }

    useEffect(() => {
        
        getCityAndPositionName()

    }, [idCity, idPosition]);

    async function getData() {
        try{

            setIsLoading(true)

            const response = await api.get(`/api/candidate/selected?idCity=${idCity}&idPosition=${idPosition}&number=${candidateNumber}`);
            const responseData = response.data.candidate as CandidateProps;
            
            if(responseData){
                setCandidateNotFound(false)
                setCandidate(responseData);
            } else{
                setCandidateNotFound(true)
            }

        } catch(err){
            alert("Erro ao carregar candidato: " + err)
        } finally{
            setIsLoading(false);
        }
    }

    // Log das coordenadas do contexto
    // useEffect(() => {
    //     if (coordinates) {
    //         console.log('Latitude:', coordinates.latitude);
    //         console.log('Longitude:', coordinates.longitude);
    //     } else {
    //         console.log("Sem localização");
    //     }
    // }, [coordinates]);

    // tela de carregamento inicial enquanto verifica credenciais de login
    if (status === 'loading') {
        return <LoadScreen />;
    }

    // selecionar candidato e abrir modal de confirmacao
    function handleSelect(idCandidate: string, name: string) {
        setCandidateSelectedId(idCandidate);
        setCandidateSelectedName(name);
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    function handleCloseFinalModal() {
        setShowFinalModal(false);
    }

    // efetuar voto
    async function handleVote() {
        setVoteInProgress(true);

        const response = await api.post(`api/vote`, {
            email: session?.user?.email,
            idCandidate: candidateSelectedId,
            latitude: coordinates?.latitude || null,
            longitude: coordinates?.longitude || 'null'
        });

        setVoteInProgress(false);

        if (response.data.status !== 200) {
            toast.error(response.data.message);
            return;
        }

        if (response.data.status === 200) {
            toast.success("Voto confirmado com sucesso!");
            handleCloseModal();
            setShowFinalModal(true);
            return;
        }
    }

    // alterar numero do candidato no teclado
    function handleSetCandidateNumber(number: string) {
        setCandidateNotFound(false)
        setCandidateNumber(number);
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen relative">
            <LogoutBtn />
            <ReturnBtn endpoint={'/votar/cidade'} />
            <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mt-16 md:mt-10" />

                <div className="p-4 w-full sm:max-w-2xl">

                    {/* filter candidate by number */}
                    <CandidateFilterNumber
                        candidateNumber={candidateNumber}
                        handleSetCandidateNumber={handleSetCandidateNumber}
                        getData={getData}
                    />

                    {isLoading && (
                        <TbLoader size={40} className="animate-spin text-gray-200 w-full text-center py-2"/>
                    )}

                    {candidateNotFound && (
                        <div className="w-full text-gray-200 border-2 bg-gray-900 border-teal-900 p-2 rounded-md mt-2">
                            <p>Nenhum(a) candidato(a) a <span className="font-medium text-teal-300">{selectedPosition?.name}</span> com o número <span className="font-medium text-teal-300">{candidateNumber}</span> foi encontrado na cidade de <span className="font-medium text-teal-300">{selectedCity?.name}</span>. Tente mudar as informações da pesquisa.</p>
                        </div>
                    )}

                    {candidate && (
                        <div className="p-4 my-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <img src={candidate.image} alt={candidate.name} className="w-20 h-20 rounded-full object-cover" />
                                <div className="flex flex-col items-end">
                                    <h3 className="font-extrabold text-xl text-cyan-800">Candidato a {candidate.Position.name}</h3>
                                    <h3 className="font-extrabold text-xl text-gray-600">{candidate.number} - {candidate.Party.name}</h3>
                                    <h3 className="text-lg font-extrabold text-gray-600">{candidate.name}</h3>
                                </div>
                            </div>
                            <p className="text-gray-500 mb-2 min-h-24 font-medium">{candidate.description}</p>
                            <button
                                className="bg-teal-900 w-full text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                                onClick={() => handleSelect(candidate.idCandidate, candidate.name)}
                            >
                                Votar
                            </button>
                        </div>
                    )}

                </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white mx-3 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4">Confirmação de Voto</h2>
                        <p className="mb-4">Você tem certeza que deseja votar em <span className="font-bold">{candidateSelectedName}</span>?</p>

                        <div className="flex justify-center gap-x-2">
                            <button
                                className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>

                            <button
                                className="bg-teal-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                                onClick={handleVote}
                                disabled={voteInProgress}
                            >
                                {voteInProgress ? <TbLoader className="animate-spin" /> : <span>Confirmar</span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showFinalModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white mx-3 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4">Voto bem sucedido!</h2>
                        <p className="mb-1">Compartilhe nossa pesquisa de votação para alcançar mais gente!</p>

                        <CopyLinkBtn />

                        <div className="flex justify-center gap-x-2 mt-4">
                            <button
                                className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700"
                                onClick={handleCloseFinalModal}
                            >
                                Novo voto
                            </button>

                            <button
                                className="bg-teal-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                                onClick={() => { signOut() }}
                            >
                                Finalizar pesquisa
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
