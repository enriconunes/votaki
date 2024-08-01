'use client'

// components/TestMap.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from "@/services/axiosConfig"; // Certifique-se de que este caminho esteja correto

// Tipos para a resposta da API
interface Geolocation {
    id: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    idVote: string;
}

interface Vote {
    idVote: string;
    email: string;
    idCandidate: string;
    createdAt: string;
    updatedAt: string;
    Geolocation: Geolocation | null;
}

interface Candidate {
    idCandidate: string;
    name: string;
    description: string;
    image: string;
    number: string;
    idPosition: string;
    idParty: string;
    idCity: string;
    createdAt: string;
    updatedAt: string;
    Vote: Vote[];
}

interface ApiResponse {
    candidate: Candidate;
    status: number;
}

// Componente para configurar o mapa com base nas geolocalizações
const MapSetup = ({ geolocations }: { geolocations: Geolocation[] }) => {
    const map = useMap();

    useEffect(() => {
        if (map) {
            // Se houver geolocalizações, define o centro com base na primeira
            if (geolocations.length > 0) {
                const { latitude, longitude } = geolocations[0];
                map.setView([latitude, longitude], 14);
            } else {
                // Caso contrário, define o centro para as coordenadas do Brasil
                map.setView([-14.235004, -51.92528], 4);
            }

            // Define um ícone de marcador personalizado
            const markerIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });

            // Adiciona marcadores com base nas geolocalizações
            geolocations.forEach(location => {
                L.marker([location.latitude, location.longitude], { icon: markerIcon })
                    .addTo(map)
                    .bindPopup('Localização de um voto.')
                    .openPopup();
            });
        }
    }, [map, geolocations]);

    return null;
};

const TestMap = ({ idCandidate }: { idCandidate: string }) => {
    const [geolocations, setGeolocations] = useState<Geolocation[]>([]);
    const [candidateName, setCandidateName] = useState('');

    useEffect(() => {
        const fetchGeolocations = async () => {
            try {
                const response = await api.get<ApiResponse>(`/api/geolocation?idCandidate=${idCandidate}`);
                const { candidate } = response.data;
                setCandidateName(candidate.name);

                // Se não houver votos, garante que geolocations será uma lista vazia
                if (candidate.Vote.length === 0) {
                    setGeolocations([]);
                    return;
                }

                // Filtra as geolocalizações válidas (não nulas)
                const validGeolocations = candidate.Vote
                    .map(vote => vote.Geolocation)
                    .filter((geo): geo is Geolocation => geo !== null);

                // Define as geolocalizações ou uma lista vazia se não houver geolocalizações válidas
                setGeolocations(validGeolocations.length > 0 ? validGeolocations : []);
            } catch (error) {
                console.error('Erro ao buscar geolocalizações:', error);
            }
        };

        fetchGeolocations();
    }, [idCandidate]);

    return (
        <div>
            <MapContainer
                style={{ height: '300px', width: '100%', margin: '0px auto 0px auto', borderRadius: '7px' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapSetup geolocations={geolocations} />
            </MapContainer>
            <p className='text-white w-full text-center mt-2 text-sm md:text-base'>Exibindo votos do(a) candidato(a) {candidateName}</p>
        </div>
    );
};

export default TestMap;
