import React, { memo } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Place } from '../../../types/place';
import getPlaceTypeIcon from '@utils/getPlaceTypeIcon';

interface OptimizedMarkerProps {
  place: Place;
  isSelected: boolean;
  onPress: (place: Place) => void;
  onImagePress?: () => void;
  navigationMode?: boolean;
}

const OptimizedMarker = memo(({ place, isSelected, onPress, onImagePress, navigationMode }: OptimizedMarkerProps) => {
  const handlePress = () => {
    if (navigationMode) {
      console.log("⚠️ OptimizedMarker - Press blocked in navigation mode");
      return;
    }
    
    console.log("🔍 OptimizedMarker - Marker pressed:", place.nombre);
    onPress(place);
    if (place.imagen && onImagePress) {
      onImagePress();
    }
  };

  const color = place.tipo.color || '#4F6DF5';

  return (
    <Marker
      coordinate={{ latitude: place.latitud, longitude: place.longitud }}
      onPress={navigationMode ? undefined : handlePress}
      anchor={{ x: 0.5, y: 1 }}

    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: color,
              borderRadius: 9999,
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#fff',
            }}
          >
            {getPlaceTypeIcon(place.tipo.nombre, {
              fill: '#fff',
              width: 16,
              height: 16,
            })}
          </View>

          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
              marginTop: -1,
            }}
          />
        </View>
      </View>
    </Marker>
  );
}, (prevProps, nextProps) => (
  prevProps.place.id === nextProps.place.id &&
  prevProps.isSelected === nextProps.isSelected &&
  prevProps.place.tipo.color === nextProps.place.tipo.color &&
  prevProps.place.latitud === nextProps.place.latitud &&
  prevProps.place.longitud === nextProps.place.longitud
));

OptimizedMarker.displayName = 'OptimizedMarker';

export default OptimizedMarker;
