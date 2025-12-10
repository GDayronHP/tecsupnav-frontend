import { useCallback, useState } from 'react';

import { usePlacesStore } from '@/stores';

export function useModal() {

    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    // Selective subscriptions for actions only
    const setSelectedPlace = usePlacesStore(s => s.setSelectedPlace);
    const setShowPlaceInfo = usePlacesStore(s => s.setShowPlaceInfo);

    const closeEmergencyModal = useCallback(() => setShowEmergencyModal(false), []);
    const closePlaceInfoCard = useCallback(() => {
        setShowPlaceInfo(false);
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