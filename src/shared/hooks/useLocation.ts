import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    let timeoutId: any;
    
    const fetchLocation = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        
        if (!isMountedRef.current) return;
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (!isMountedRef.current) return;
        
        setLocation(loc);
      } catch (error) {
        if (!isMountedRef.current) return;
        setErrorMsg('Error getting location');
        console.error('Error fetching location:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Defer location fetch to avoid blocking
    timeoutId = setTimeout(fetchLocation, 100);
    
    return () => {
      isMountedRef.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { location, errorMsg, loading };
};


