// layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Offline from "./errors/Network";
import useCriticalErrorStore from "../stores/criticalErrorStore";
import GlobalError from "./errors/Global";
import Toasts from "../components/Toasts";
import { useEffect } from "react";

const MainLayout = () => {
  const criticalError = useCriticalErrorStore((state) => state.isCriticalError);
  const error = useCriticalErrorStore((state) => state.error) as Error;
  const reset = useCriticalErrorStore((state) => state.fixingFunction);

  useEffect(() => {}, []);

  if (criticalError) {
    return (
      <>
        <Toasts />
        <GlobalError error={error} reset={reset} />
      </>
    );
  }

  return (
    <>
      <Toasts />
      <Offline />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
