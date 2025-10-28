import { UserProvider } from "@context/UserContext";
import { SidebarProvider } from "@features/home/context/SidebarContext";
import HomeContainer from "@features/home/screens/HomeContainer";

export default function HomeIndex() {
  return (
    <UserProvider>
      <SidebarProvider>
        <HomeContainer />
      </SidebarProvider>
    </UserProvider>
  );
}
