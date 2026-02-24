import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./features/context/AuthProvider";
import { PostContextProvider } from "./features/context/post.context";
const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <AppRoutes />
      </PostContextProvider>
    </AuthProvider>
  );
};

export default App;
