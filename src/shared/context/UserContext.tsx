import { createContext, useContext, useEffect, useState } from "react";
import { useSettingsService } from "@features/settings/services/SettingsService";
import { UserV3 } from "@types/auth";
import { Alert } from "react-native";

const UserContext = createContext(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserV3 | null>(null);

    const settingsService = useSettingsService();

    const fetchUserInfo = async () => {
        try {
            const userData = await settingsService.getUserInfo();
            setUserData(userData);
        } catch (err) {
            console.error("Error fetching user info:", err);
            Alert.alert("Error", "No se pudo obtener la información del usuario.");
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);
    return (
        <UserContext.Provider value={{ userData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);