import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  performanceMode: boolean;
  notifications: boolean;
  location: boolean;
  darkMode: boolean;
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  isPerformanceModeEnabled: boolean;
  isLoading: boolean;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'tecsupnav_app_settings';

const defaultSettings: AppSettings = {
  performanceMode: false,
  notifications: true,
  location: true,
  darkMode: false,
};

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      
      // Log para debug
      if (key === 'performanceMode') {
        console.log(`Performance mode ${value ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const value: AppSettingsContextType = {
    settings,
    updateSetting,
    isPerformanceModeEnabled: settings.performanceMode,
    isLoading,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};