import { ShieldX } from "lucide-react";

export default function _403() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <ShieldX className="h-12 w-12 text-error" />
          </div>
          <h1 className="text-4xl font-bold">403</h1>
          <h2 className="text-2xl font-semibold mt-2">Access Forbidden</h2>
          <p className="mt-4 text-base-content/70">
            You don't have permission to access this page.
          </p>
          <div className="card-actions mt-6 flex flex-col sm:flex-row gap-2 w-full">
            <a href="/" className="btn btn-outline flex-1">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
