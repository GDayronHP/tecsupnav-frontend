import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { usePlaces } from '@context/PlacesContext';

export const useLocation = () => {
  const { gpsStatus } = usePlaces();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocation = async () => {
      if (gpsStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch {
        setErrorMsg('Error getting location');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [gpsStatus]);

  return { location, errorMsg, loading };
};


