import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { usePerformantAnimation } from '@hooks/usePerformantAnimation';
import Map from '@features/home/components/Map';
import { usePlacesStore, useNavigationStore } from '@/stores';
import NavigationCard from '../components/NavigationCard';
import NavigationBottomBar from '../components/NavigationBottomBar';
import Loading from '@components/Loading';
import useNavigation from '../hooks/useNavigation';

export default function NavigationScreen() {
  const {
    isLoading,
    navigation,
    showNavigationCard,
    handleCancel,
  } = useNavigation();

  const { animatedValue: cardTranslateY, animateWithSpring: animateCardTranslateY } = usePerformantAnimation(300);
  const { animatedValue: cardOpacity, animateWithTiming: animateCardOpacity } = usePerformantAnimation(0);

  // Selective subscriptions to prevent unnecessary re-renders
  const locations = usePlacesStore(s => s.locations);
  const selectedPlace = usePlacesStore(s => s.selectedPlace);
  const showRoute = usePlacesStore(s => s.showRoute);

  useEffect(() => {
    if (showNavigationCard) {
      animateCardOpacity(1, { duration: 300 });
      animateCardTranslateY(0, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [showNavigationCard, animateCardOpacity, animateCardTranslateY]);

  const memoizedMap = useMemo(() => (
    <Map
      locations={locations}
      selectedPlace={selectedPlace}
      showRoute={showRoute}
      navigationMode={true}
    />
  ), [locations, selectedPlace, showRoute]);

  if (isLoading) {
    return (
      <Loading
        title='Preparando navegación'
        description='Calculando ruta y pasos a seguir...'
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Map */}
      {memoizedMap}

      {/* Navigation Card */}
      {showNavigationCard && (
        <NavigationCard navigationData={navigation} />
      )}

      {/* Bottom bar with place information */}
      <NavigationBottomBar
        selectedPlace={selectedPlace}
        navigation={navigation}
        handleCancel={handleCancel}
        navigationData={navigation}
      />
    </View>
  );
}