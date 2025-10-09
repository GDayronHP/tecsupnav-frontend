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
                    color={location.tipo.color}
                    filteredLocations={filteredLocations}
                    handleLocationView={handleLocationView}
                    handleLocationRoute={handleLocationRoute}
                />
            ))
        }
    </>
}