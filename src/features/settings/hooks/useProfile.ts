import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useSettingsService } from "../services/SettingsService";
import { router } from "expo-router/build/exports";
import { authService } from "@features/auth/services/authService";

// Definimos el tipo localmente para evitar problemas de importación
export interface UserProfile {
  id: string;
  email: string;
  nombreCompleto: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: "ADMIN" | "STUDENT";
  createdAt: string;
}

export interface UseProfileReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settingsService = useSettingsService();

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await settingsService.getUserInfo();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const refetch = async () => {
    await fetchUserInfo();
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.push("/auth");
        },
      },
    ]);
  };

  return {
    user,
    loading,
    error,
    refetch,
    handleLogout,
  };
};

export default useProfile;
