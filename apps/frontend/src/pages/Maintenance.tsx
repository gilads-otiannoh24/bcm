"use client";
import { Wrench, Clock } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="w-24 h-24 rounded-full bg-info/10 flex items-center justify-center mb-4">
            <Wrench className="h-12 w-12 text-info" />
          </div>
          <h1 className="text-2xl font-bold">Under Maintenance</h1>
          <p className="mt-4 text-base-content/70">
            We're currently performing scheduled maintenance on our servers.
            We'll be back shortly!
          </p>
          <div className="flex items-center justify-center mt-4 text-info">
            <Clock className="h-5 w-5 mr-2" />
            <p className="font-medium">Estimated downtime: 30 minutes</p>
          </div>
          <div className="card-actions mt-6 w-full">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary w-full"
            >
              Refresh Page
            </button>
          </div>
          <p className="text-xs text-base-content/50 mt-4">
            If you need immediate assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
