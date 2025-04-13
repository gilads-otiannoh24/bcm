"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Define the forgot password form schema with Zod
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export function ForgotPasswordForm() {
  // Form state
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuth();

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear errors when user types
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setValidationError(null);

    // Validate form data
    try {
      forgotPasswordSchema.parse({ email });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0]?.message || "Invalid email address");
        return;
      }
    }

    // If validation passes, submit the form
    try {
      setIsLoading(true);

      const response = await forgotPassword(email);

      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      if (err.status === 404) {
        setError(err.response.data.error);
        return;
      }

      setError(
        "An error occurred while sending the reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <a
          href="/login"
          className="flex items-center text-sm mb-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </a>

        <h2 className="card-title text-2xl">Forgot Password</h2>
        <p className="text-base-content/70">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {isSuccess ? (
          <div className="mt-6 space-y-4">
            <div className="alert alert-success">
              <CheckCircle className="h-5 w-5" />
              <span>
                Password reset link sent! Please check your email and follow the
                instructions to reset your password.
              </span>
            </div>
            <p className="text-sm text-base-content/70">
              If you don't receive an email within a few minutes, please check
              your spam folder or try again.
            </p>
            <div className="card-actions mt-4">
              <button
                className="btn btn-outline w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
              >
                Try another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Show error if any */}
            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="fieldset w-full mt-4">
              <label className="fieldset-legend" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  className={`input input-bordered w-full pl-10 ${
                    validationError ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationError && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationError}
                  </span>
                </label>
              )}
            </div>

            <div className="card-actions mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>

            <div className="text-center mt-4 text-sm">
              Remember your password?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
