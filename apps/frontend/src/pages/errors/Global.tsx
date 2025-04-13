"use client";

import { useEffect } from "react";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
          <div className="card bg-base-100 shadow-xl max-w-md w-full">
            <div className="card-body items-center text-center">
              <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <AlertOctagon className="h-12 w-12 text-error" />
              </div>
              <h1 className="text-2xl font-bold">Critical Error</h1>
              <p className="mt-4 text-base-content/70">
                We're sorry, but a critical error has occurred in the
                application.
              </p>
              <div className="card-actions mt-6 flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={() => reset()}
                  className="btn btn-primary flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Application
                </button>
                <a href="/" className="btn btn-outline flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </a>
              </div>
              <p className="text-xs text-base-content/50 mt-4">
                If this problem persists, please contact support or try again
                later.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
