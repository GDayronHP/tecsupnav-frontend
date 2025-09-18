import React, { useEffect } from "react";

import { Place } from "@types/place";
import PlaceElement from "./PlaceElement";

type PlacesContainerProps = {
    filteredLocations: Place[];
    setSelectedPlace: (place: Place) => void;
    closeSidebar: () => void;
    setShowPlaceInfo: (show: boolean) => void;
    setShowRoute: (show: boolean) => void;
};

export default function PlacesContainer({ filteredLocations = [], setSelectedPlace, closeSidebar, setShowPlaceInfo, setShowRoute }: PlacesContainerProps) {

    useEffect(() => {
        console.log("Filtered Locations updated:", filteredLocations);
    }, [filteredLocations]);


    // It has to be changed with a new property in the API
    const getBadgeClasses = (category) => {
        const styles = {
            laboratorio: 'bg-badge-laboratorio-bg text-badge-laboratorio-text',
            biblioteca: 'bg-badge-servicio-bg text-badge-servicio-text',
            aula: 'bg-badge-activo-bg text-badge-activo-text',
            pabellon: 'bg-badge-nuevo-bg text-badge-nuevo-text',
            cafetería: 'bg-badge-cafeteria-bg text-badge-cafeteria-text',
            oficina: 'bg-badge-oficina-bg text-badge-oficina-text',
            default: 'bg-nuevo-bg text-badge-nuevo-text',
        };
        return styles[category] || styles.default;
    };

    const handleLocationView = (location) => {
        setSelectedPlace(location);
        setShowRoute(false);
        closeSidebar();
    };

    const handleLocationRoute = (location) => {
        setSelectedPlace(location);
        setShowPlaceInfo(true);
        setShowRoute(true);
        closeSidebar();
    }

    return <>
        {
            filteredLocations.map((location, index) => (
                <PlaceElement
                    key={location.id}
                    location={location}
                    index={index}
                    filteredLocations={filteredLocations}
                    handleLocationView={handleLocationView}
                    handleLocationRoute={handleLocationRoute}
                    getBadgeClasses={getBadgeClasses}
                />
            ))
        }
    </>
}