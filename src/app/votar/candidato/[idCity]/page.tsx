'use client'

import LogoutBtn from "@/components/Buttons/LogoutBtn";
import LoadScreen from "@/components/LoadScreen";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import api from "@/services/axiosConfig";
import { toast } from "react-toastify";
import LoadComponent from "@/components/LoadComponent";
import ReturnBtn from "@/components/Buttons/ReturnBtn";
import { TbLoader } from "react-icons/tb";
import CopyLinkBtn from "@/components/Buttons/CopyLinkBtn";
import { signOut } from "next-auth/react"
import CandidateFilterNumber from "@/components/Forms/CandidadeFilterNumber";

type Party = {
    idParty: string;
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
};

type PositionsResponse = {
    idPosition: string;
    name: string;
    Candidate: CandidateProps[];
};

export default function Votar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router, session]);

    const [candidateNumber, setCandidateNumber] = useState('');
    const [positions, setPositions] = useState<PositionsResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [voteInProgress, setVoteInProgress] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFinalModal, setShowFinalModal] = useState(false);
    const [candidateSelectedId, setCandidateSelectedId] = useState('');
    const [candidateSelectedName, setCandidateSelectedName] = useState('');

    const { idCity } = useParams()
    
    async function getData() {
        // se candidateNumber for vazio, passa number=all como parametro, senao passa o valor do number selecionado no input
        const response = await api.get(`/api/candidate/positions?idCity=${idCity}&number=${!candidateNumber ? 'all' : candidateNumber}`);
        const responseData = response.data.positions as PositionsResponse[];
        setPositions(responseData);
        setIsLoading(false);
    }
    
    useEffect(() => {
        getData();
    }, [candidateNumber]);

    // status do useSession(), nextAuth
    if (status === 'loading') {
        return <LoadScreen />
    }

    // selecionar candidato e abrir modal para confimacao do voto
    function handleSelect(idCandidate: string, name: string){
        setCandidateSelectedId(idCandidate)
        setCandidateSelectedName(name)
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    function handleCloseFinalModal(){
        setShowFinalModal(false);
    }

    // finalizar voto dentro do modal de confirmacao
    async function handleVote(){

        setVoteInProgress(true)

        const response = await api.post(`api/vote`, {
            email: session?.user?.email,
            idCandidate: candidateSelectedId
        });

        setVoteInProgress(false)

        if(response.data.status !== 200){
            toast.error(response.data.message)
            return
        }

        if(response.data.status === 200){
            toast.success("Voto confirmado com sucesso!")
            handleCloseModal()
            setShowFinalModal(true)
            return
        }
    }

    // funcao usada dentro do componente de filtragem de candidatos pelo numero. 
    function handleSetCandidateNumber(number: string){
        setCandidateNumber(number)
    }
    
    return (
        <div className="flex flex-col justify-center items-center min-h-screen relative">
            <LogoutBtn />
            <ReturnBtn endpoint={'/votar/cidade'}/>
            <img src={"/LogoWhite.png"} alt="Logo Votaki" className="sm:w-2/6 w-2/3 mt-16 md:mt-10" />

            {isLoading ? (
                <div className="p-4 flex flex-col justify-center items-center w-full sm:max-w-2xl mt-10">
                    <LoadComponent />
                    <span className="text-white font-medium mt-2 text-lg">Carregando candidatos...</span>
                </div>
            ) : (
                <div className="p-4 w-full sm:max-w-2xl">

                    {/* filter candidate by number */}
                    <CandidateFilterNumber
                    candidateNumber={candidateNumber}
                    handleSetCandidateNumber={handleSetCandidateNumber}
                    />

                    {positions.map((position) => (
                        <div key={position.idPosition} className="my-8">
                            <h2 className="text-2xl font-bold text-white mb-4">{position.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {position.Candidate.length == 0 ? (
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                                        <h3 className="font-semibold text-gray-600 flex">
                                                Nenhum candidato a {position.name} foi encontrado na sua cidade{!candidateNumber ? '.' : ` com o número ${candidateNumber}.`}
                                        </h3>
                                    </div>
                                ) : (
                                    position.Candidate.map((candidate) => (
                                        <div key={candidate.idCandidate} className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <img src={candidate.image} alt={candidate.name} className="w-16 h-16 rounded-full object-cover" />
                                                <div className="flex flex-col items-end">
                                                    <h3 className="font-extrabold text-xl text-cyan-800">{candidate.number} - {candidate.Party.name}</h3>
                                                    <h3 className="text-lg font-extrabold text-gray-700">{candidate.name}</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2 min-h-24">{candidate.description}</p>
                                            <button
                                                className="bg-teal-900 w-full text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                                                onClick={() => handleSelect(candidate.idCandidate, candidate.name)}
                                            >
                                                Votar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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
                        <p className="mb-1">Compartilhe a pesquisa de votação para alcançar mais gente!</p>

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
                                onClick={() => {signOut()}}
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
