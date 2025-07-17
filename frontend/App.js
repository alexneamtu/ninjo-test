import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator/>
      <StatusBar style="auto"/>
    </AuthProvider>
  );
}
