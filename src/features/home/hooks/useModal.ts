import { useCallback, useState } from 'react';

import { usePlaces } from '@context/PlacesContext';

export function useModal() {

    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const {
        setSelectedPlace,
        setShowPlaceInfo
    } = usePlaces();

    const closeEmergencyModal = useCallback(() => setShowEmergencyModal(false), []);
    const closePlaceInfoCard = useCallback(() => {
        setShowPlaceInfo(false);
        setSelectedPlace(null);
    }, []);

    return (
        {
            showEmergencyModal,
            setShowEmergencyModal,
            closeEmergencyModal,
            closePlaceInfoCard
        }
    )
}