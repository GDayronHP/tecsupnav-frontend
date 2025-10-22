import { useEffect } from "react";
import { settingsService } from "../services/SettingsService";

const useUserData = () => {
    useEffect(() => {
        async function loadUser() {
            const user = await settingsService.getMobileDashboard();
            console.log(user);
        }

        loadUser();
    }, []);
    return {};
}

export default useUserData;