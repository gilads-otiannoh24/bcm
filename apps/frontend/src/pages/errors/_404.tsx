"use client";

import { FileQuestion } from "lucide-react";

export default function _404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center mb-4">
            <FileQuestion className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
          <p className="mt-4 text-base-content/70">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="card-actions mt-6 flex flex-col sm:flex-row gap-2 w-full">
            <a href="/" className="btn btn-primary flex-1">
              Go Home
            </a>
            <button
              className="btn btn-outline flex-1"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
