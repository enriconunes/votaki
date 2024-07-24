import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import api from "@/services/axiosConfig"; // Certifique-se de que o caminho esteja correto para o seu projeto
import { UploadButton } from "@uploadthing/react";

type City = {
  idCity: string;
  name: string;
}

type Party = {
  idParty: string;
  name: string;
}

type Position = {
  idPosition: string;
  name: string;
}

type CandidateProps = {
  idCandidate: string;
  name: string;
  description: string;
  image: string;
  idPosition: string;
  idParty: string;
  idCity: string;
  createdAt: Date;
  updatedAt: Date;
  City: City;
  Party: Party;
  Position: Position;
};

interface ListingProps {
  candidates: CandidateProps[];
  cities: City[];
  parties: Party[];
  positions: Position[];
}

export default function CandidatesListing({ candidates, cities, parties, positions }: ListingProps) {
    const [activeCollapse, setActiveCollapse] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateProps | null>(null);
    const [editingCandidate, setEditingCandidate] = useState<CandidateProps | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPosition, setEditPosition] = useState("");
    const [editParty, setEditParty] = useState("");
    const [editCity, setEditCity] = useState("");


    const toggleCollapse = (id: string) => {
    setActiveCollapse(prev => (prev === id ? null : id));
    };

    const handleDelete = async () => {
        if (!selectedCandidate) return;

        try {
            await api.delete(`/api/candidate`, {
            data: { idCandidate: selectedCandidate.idCandidate }
            });
            toast.success(`Candidato ${selectedCandidate.name} deletado com sucesso!`);
            setSelectedCandidate(null);
        } catch (error) {
            toast.error("Erro ao deletar candidato: " + error);
        }
    };

    const openEditModal = (candidate: CandidateProps) => {
        setEditingCandidate(candidate);
        setEditName(candidate.name);
        setEditDescription(candidate.description);
        setEditPosition(candidate.idPosition);
        setEditParty(candidate.idParty);
        setEditCity(candidate.idCity);
    };

    const handleEditSubmit = async () => {
        if (!editingCandidate) return;

        try {
            await api.put(`/api/candidate`, {
                idCandidate: editingCandidate.idCandidate,
                name: editName,
                description: editDescription,
                idPosition: editPosition,
                idParty: editParty,
                idCity: editCity,
            });

            toast.success("Candidato atualizado com sucesso!");
            setEditingCandidate(null);
        } catch (error) {
            toast.error("Erro ao atualizar candidato: " + error);
        }
    };



    return (
        <div className="max-h-96 overflow-y-scroll">
            {candidates.map(candidate => (
            <div key={candidate.idCandidate}>
                <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 gap-3"
                onClick={() => toggleCollapse(candidate.idCandidate)}
                >
                <div className="flex items-center gap-3">
                    <img src={candidate.image} alt={candidate.name} className="w-12 h-12 object-cover rounded-full" />
                    <span>{candidate.name}</span>
                </div>
                <svg
                    className={`w-3 h-3 ${activeCollapse === candidate.idCandidate ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5L5 1 1 5"
                    />
                </svg>
                </button>
                <div className={`${activeCollapse === candidate.idCandidate ? 'block' : 'hidden'} p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900`}>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Descrição:</strong> {candidate.description}</p>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Posição:</strong> {candidate.Position.name}</p>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Partido:</strong> {candidate.Party.name}</p>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Cidade:</strong> {candidate.City.name}</p>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Criado em:</strong> {new Date(candidate.createdAt).toLocaleString()}</p>
                <p className="mb-2 text-gray-500 dark:text-gray-400"><strong>Atualizado em:</strong> {new Date(candidate.updatedAt).toLocaleString()}</p>
                <div className="flex justify-end gap-2">
                    <FaEdit size={24} className="text-yellow-500 hover:text-yellow-700 cursor-pointer" onClick={() => openEditModal(candidate)}/>
                    <MdDelete size={24} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setSelectedCandidate(candidate)} />
                </div>
                </div>
            </div>
        ))}

        {/* Modal de confirmação de exclusão */}
        {selectedCandidate && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white mx-3 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                <p className="mb-4">Tem certeza que deseja deletar o candidato <span className="font-bold">{selectedCandidate.name}</span>?</p>
                    <div className="flex justify-center gap-x-2">
                        <button
                        className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700"
                        onClick={() => setSelectedCandidate(null)}
                        >
                        Cancelar
                        </button>
                        <button
                        className="bg-teal-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                        onClick={handleDelete}
                        >
                        Confirmar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {editingCandidate && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white mx-3 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                    <h2 className="text-xl font-bold mb-4">Editar Candidato</h2>

                    {/* upload image with uploadThing */}
                    {/* <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: any) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        alert("Upload Completed");
                        }}
                        onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                        }}
                    /> */}

                    <form className="text-left">
                        <div className="mb-4">
                        <label htmlFor="editName" className="block text-gray-700">Nome:</label>
                        <input
                            type="text"
                            id="editName"
                            name="editName"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="editDescription" className="block text-gray-700">Descrição:</label>
                        <textarea
                            id="editDescription"
                            name="editDescription"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="editPosition" className="block text-gray-700">Posição:</label>
                        <select
                            id="editPosition"
                            name="editPosition"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            value={editPosition}
                            onChange={(e) => setEditPosition(e.target.value)}
                        >
                            {positions.map(position => (
                            <option key={position.idPosition} value={position.idPosition}>{position.name}</option>
                            ))}
                        </select>
                        </div>
                        <div className="mb-4">
                        <label htmlFor="editParty" className="block text-gray-700">Partido:</label>
                        <select
                            id="editParty"
                            name="editParty"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            value={editParty}
                            onChange={(e) => setEditParty(e.target.value)}
                        >
                            {parties.map(party => (
                            <option key={party.idParty} value={party.idParty}>{party.name}</option>
                            ))}
                        </select>
                        </div>
                        <div className="mb-4">
                        <label htmlFor="editCity" className="block text-gray-700">Cidade:</label>
                        <select
                            id="editCity"
                            name="editCity"
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                        >
                            {cities.map(city => (
                            <option key={city.idCity} value={city.idCity}>{city.name}</option>
                            ))}
                        </select>
                        </div>
                        <div className="flex justify-center gap-x-2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700"
                            onClick={() => setEditingCandidate(null)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="bg-teal-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-950"
                            onClick={handleEditSubmit}
                        >
                            Confirmar
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        )}


        </div>
    );
}
