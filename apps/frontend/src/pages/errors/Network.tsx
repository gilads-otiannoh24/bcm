"use client";

import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";

export default function Offline() {
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsDismissed(false);
      setIsOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-50">
      <div className="alert alert-warning shadow-lg">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-3 items-center">
            <WifiOff className="h-5 w-5" />
            <span>
              You are currently offline. Some features may be unavailable.
            </span>
          </div>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
