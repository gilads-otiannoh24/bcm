"use client";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouteError } from "react-router-dom";

const ErrorBoundary = () => {
  const error = useRouteError() as Error;

  const handleReset = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-error" />
          </div>
          <h1 className="text-2xl font-bold">Something Went Wrong</h1>
          <p className="mt-4 text-base-content/70">
            We're sorry, but we encountered an unexpected error.
          </p>
          {error?.message && (
            <div className="alert alert-error mt-4">
              <p>{error.message}</p>
            </div>
          )}
          <div className="card-actions mt-6 flex flex-col sm:flex-row gap-2 w-full">
            <button onClick={handleReset} className="btn btn-primary flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <a href="/" className="btn btn-outline flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </div>
          <p className="text-xs text-base-content/50 mt-4">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
