import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./App.routes";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes></AppRoutes>
      </QueryClientProvider>
    </AuthProvider>
  );
}
export default App;
