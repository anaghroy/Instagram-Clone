import { RouterProvider } from "react-router";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/context/AuthProvider";
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
