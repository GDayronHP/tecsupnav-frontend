import { create } from 'zustand';

interface NavigationData {
  distance: string;
  duration: string;
  steps: any[];
  polyline: string;
  startFloor?: string;
  endFloor?: string;
}

interface NavigationStore {
  isLoading: boolean;
  navigation: NavigationData | null;
  showNavigationCard: boolean;
  hasArrivedAlertShown: boolean;
  
  // Actions
  setIsLoading: (loading: boolean) => void;
  setNavigation: (nav: NavigationData | null) => void;
  setShowNavigationCard: (show: boolean) => void;
  setHasArrivedAlertShown: (shown: boolean) => void;
  startNavigation: (nav: NavigationData) => void;
  stopNavigation: () => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isLoading: false,
  navigation: null,
  showNavigationCard: false,
  hasArrivedAlertShown: false,
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  setNavigation: (nav) => set({ navigation: nav }),
  setShowNavigationCard: (show) => set({ showNavigationCard: show }),
  setHasArrivedAlertShown: (shown) => set({ hasArrivedAlertShown: shown }),
  
  startNavigation: (nav) => set({
    navigation: nav,
    showNavigationCard: true,
    isLoading: false,
    hasArrivedAlertShown: false
  }),
  
  stopNavigation: () => set({
    navigation: null,
    showNavigationCard: false,
    hasArrivedAlertShown: false
  }),
  
  resetNavigation: () => set({
    isLoading: false,
    navigation: null,
    showNavigationCard: false,
    hasArrivedAlertShown: false
  })
}));
