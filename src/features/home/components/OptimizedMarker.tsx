import React, { memo } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Place } from '../../../types/place';
import getPlaceTypeIcon from '@utils/getPlaceTypeIcon';

interface OptimizedMarkerProps {
  place: Place;
  isSelected: boolean;
  onPress: (place: Place) => void;
  navigationMode?: boolean;
  selectedFloor?: number | null;
}

const OptimizedMarker = memo(({ place, isSelected, onPress, navigationMode, selectedFloor }: OptimizedMarkerProps) => {
  const handlePress = () => {
    if (navigationMode) {
      console.log("⚠️ OptimizedMarker - Press blocked in navigation mode");
      return;
    }

    if (selectedFloor !== null && place.piso !== selectedFloor) {
      console.log("🚫 OptimizedMarker - Marker blocked: different floor");
      return;
    }

    console.log("🔍 OptimizedMarker - Marker pressed:", place.nombre);
    onPress(place);
  };

  const getOpacity = () => {
    if (navigationMode) return 1; 
    if (selectedFloor === null || selectedFloor === undefined) return 1;
    
    const placePiso = place.piso ?? 0;
    const diff = Math.abs(placePiso - selectedFloor);
    
    if (diff === 0) return 1;
    if (placePiso > selectedFloor) return 0.5;
    return 0.3;
  };

  const opacity = getOpacity();
  const color = place.tipo.color || '#4F6DF5';

  const markerSize = isSelected ? 32 : 24;
  const iconSize = isSelected ? 32 : 12;
  const borderWidth = isSelected ? 4 : 2;
  const borderColor = '#fff';
  const anchor = isSelected ? { x: 0.35, y: 1 } : { x: 0.25, y: 0.8 };

  return (
    <Marker
      coordinate={{ latitude: place.latitud, longitude: place.longitud }}
      onPress={navigationMode ? undefined : handlePress}
      anchor={anchor}
      opacity={opacity}
    >
      {!isSelected ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: opacity,
          }}
        >
          <View
            style={{
              backgroundColor: color,
              borderRadius: 9999,
              width: markerSize,
              height: markerSize,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: borderWidth,
              borderColor: borderColor,
            }}
          >
            {getPlaceTypeIcon(place.tipo.nombre, {
              fill: '#fff',
              width: iconSize,
              height: iconSize,
            })}
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 5,
              borderRightWidth: 5,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: "white",
              marginTop: -1,
            }}
          />
        </View>)
        : (
          (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                opacity: opacity,
              }}
            >
              <View
                style={{
                  backgroundColor: '#ba041c',
                  borderRadius: 9999,
                  width: markerSize,
                  height: markerSize,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: borderWidth,
                  borderColor: 'red',
                }}
              >
              </View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 5,
                  borderRightWidth: 5,
                  borderTopWidth: 6,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: "red",
                  marginTop: -1,
                }}
              />
            </View>)
        )
      }

    </Marker>
  );
}, (prevProps, nextProps) => (
  prevProps.place.id === nextProps.place.id &&
  prevProps.isSelected === nextProps.isSelected &&
  prevProps.place.tipo.color === nextProps.place.tipo.color &&
  prevProps.place.latitud === nextProps.place.latitud &&
  prevProps.place.longitud === nextProps.place.longitud &&
  prevProps.selectedFloor === nextProps.selectedFloor
));

OptimizedMarker.displayName = 'OptimizedMarker';

export default OptimizedMarker;
