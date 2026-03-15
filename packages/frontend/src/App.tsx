import "./App.css";
import { useCallback, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import AppInitializationLoader from "./components/ui/AppInitializationLoader";

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const handleInitializationComplete = useCallback(() => {
    setIsInitializing(false);
  }, []);

  if (isInitializing) {
    return <AppInitializationLoader onComplete={handleInitializationComplete} />;
  }

  return <RouterProvider router={router} />;
}

export default App;
