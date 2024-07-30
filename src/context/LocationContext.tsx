import { createContext, ReactNode, useState, useEffect, useContext } from "react";

// Define os tipos para o contexto de localização
type Coordinates = {
  latitude: number;
  longitude: number;
} | null;

type LocationContextData = {
  coordinates: Coordinates;
  setCoordinates: (coords: Coordinates) => void;
  locationError: string | null;
};

type LocationProviderProps = {
  children: ReactNode;
};

// Cria o contexto com um valor inicial
export const LocationContext = createContext<LocationContextData | undefined>(undefined);

// Provider do contexto
export function LocationProvider({ children }: LocationProviderProps) {
  const [coordinates, setCoordinates] = useState<Coordinates>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords);
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError('Geolocalização não é suportada pelo seu navegador.');
    }
  }, []);

  return (
    <LocationContext.Provider value={{ coordinates, setCoordinates, locationError }}>
      {children}
    </LocationContext.Provider>
  );
}

// Hook personalizado para acessar o contexto
export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation deve ser usado dentro de um LocationProvider");
  }
  return context;
}
