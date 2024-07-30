'use client'

// components/TestMap.tsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dados fictícios de localização para Vitória da Conquista com 20 localizações aleatórias próximas
const fakeLocations = [
    { lat: -14.861, lng: -40.836 },
    { lat: -14.862, lng: -40.837 },
    { lat: -14.860, lng: -40.834 },
    { lat: -14.859, lng: -40.832 },
    { lat: -14.863, lng: -40.835 },
    { lat: -14.858, lng: -40.838 },
    { lat: -14.864, lng: -40.836 },
    { lat: -14.862, lng: -40.839 },
    { lat: -14.860, lng: -40.833 },
    { lat: -14.859, lng: -40.837 },
    { lat: -14.861, lng: -40.835 },
    { lat: -14.862, lng: -40.834 },
    { lat: -14.860, lng: -40.831 },
    { lat: -14.863, lng: -40.838 },
    { lat: -14.858, lng: -40.833 },
    { lat: -14.861, lng: -40.839 },
    { lat: -14.859, lng: -40.836 },
    { lat: -14.860, lng: -40.832 },
    { lat: -14.864, lng: -40.834 },
    { lat: -16.4307268, lng: -39.0945864 }
];

// Definir um componente para configurar o mapa
const MapSetup = () => {
    const map = useMap();

    useEffect(() => {
        if (map) {
            // Define o centro e o nível de zoom
            map.setView([-14.860, -40.835], 14);

            // Define um ícone de marcador personalizado
            const markerIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });

            // Adiciona marcadores com base nos dados fictícios
            fakeLocations.forEach(location => {
                L.marker([location.lat, location.lng], { icon: markerIcon })
                    .addTo(map)
                    .bindPopup('Localização de um voto.')
                    .openPopup();
            });
        }
    }, [map]);

    return null;
};

const TestMap = () => {
    return (
        <MapContainer
            style={{ height: '300px', width: '100%', margin: '25px auto 40px auto', borderRadius: '7px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSetup />
        </MapContainer>
    );
};

export default TestMap;
