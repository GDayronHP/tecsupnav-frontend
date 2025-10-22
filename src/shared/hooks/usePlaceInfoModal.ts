import { useState, useCallback, useRef } from 'react';
import type { Place } from '../../types/place';

export const usePlaceInfoModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  const showModal = useCallback((place: Place) => {
    console.log('🏠 usePlaceInfoModal - showModal called for:', place.nombre);
    
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Evitar múltiples transiciones simultáneas
    if (isTransitioningRef.current) {
      console.log('🏠 usePlaceInfoModal - Transition in progress, ignoring');
      return;
    }

    isTransitioningRef.current = true;

    // Si ya hay un modal visible para un lugar diferente, ocultarlo primero
    if (isVisible && selectedPlace?.id !== place.id) {
      console.log('🏠 usePlaceInfoModal - Different place, hiding current modal first');
      setIsVisible(false);
      
      timeoutRef.current = setTimeout(() => {
        setSelectedPlace(place);
        setModalKey(prev => prev + 1);
        setIsVisible(true);
        isTransitioningRef.current = false;
        console.log('🏠 usePlaceInfoModal - Modal shown for:', place.nombre);
      }, 400); // Esperar a que termine la animación de cierre
    } else if (!isVisible) {
      // Mostrar modal directamente
      console.log('🏠 usePlaceInfoModal - Showing modal directly');
      setSelectedPlace(place);
      setModalKey(prev => prev + 1);
      setIsVisible(true);
      isTransitioningRef.current = false;
    } else {
      // El mismo lugar, solo actualizar datos si es necesario
      console.log('🏠 usePlaceInfoModal - Same place, updating data');
      setSelectedPlace(place);
      isTransitioningRef.current = false;
    }
  }, [isVisible, selectedPlace]);

  const hideModal = useCallback(() => {
    console.log('🏠 usePlaceInfoModal - hideModal called');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsVisible(false);
    isTransitioningRef.current = true;
    
    timeoutRef.current = setTimeout(() => {
      setSelectedPlace(null);
      isTransitioningRef.current = false;
      timeoutRef.current = null;
      console.log('🏠 usePlaceInfoModal - Modal hidden and cleaned');
    }, 400); // Esperar a que termine la animación
  }, []);

  const forceRefresh = useCallback(() => {
    console.log('🏠 usePlaceInfoModal - forceRefresh called');
    setModalKey(prev => prev + 1);
  }, []);

  return {
    isVisible,
    selectedPlace,
    modalKey,
    showModal,
    hideModal,
    forceRefresh,
    isTransitioning: isTransitioningRef.current
  };
};

export default usePlaceInfoModal;