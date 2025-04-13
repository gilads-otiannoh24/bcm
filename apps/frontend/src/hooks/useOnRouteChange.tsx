import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useOnRouteChange = (callback: () => void) => {
  const location = useLocation();

  useEffect(() => {
    callback();
  }, [location.pathname]); // Runs every time the URL path changes
};

export default useOnRouteChange;
