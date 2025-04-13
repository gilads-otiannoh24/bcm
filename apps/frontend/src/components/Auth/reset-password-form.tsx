"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PasswordResetRequest } from "@shared/types";

// Define the reset password form schema with Zod
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define the form input types
type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  // Form state
  const [formData, setFormData] = useState<ResetPasswordFormInputs>({
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string[];
    confirmPassword?: string[];
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const { validateResetToken, resetPassword } = useAuth();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await validateResetToken(token);

        if (!res.data.success) {
          setIsTokenValid(false);
        } else {
          setIsTokenValid(true);
        }
      } catch (err) {
        console.error("Token validation error:", err);
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear error when user types
    if (error) {
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setValidationErrors({});
    setError(null);

    // Validate form data
    try {
      resetPasswordSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format and set validation errors
        const errors = err.format() as any;
        setValidationErrors({
          password: errors.password?._errors,
          confirmPassword: errors.confirmPassword?._errors,
        });
        return;
      }
    }

    // If validation passes, submit the form
    try {
      setIsLoading(true);

      const requestFormSend: PasswordResetRequest = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token: token,
      };

      const res = await resetPassword(requestFormSend);

      if (res.data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        "An error occurred while resetting your password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Validating your reset link...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-error mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
            <p className="mb-6">
              The password reset link is invalid or has expired. Please request
              a new password reset link.
            </p>
            <a href="/forgot-password" className="btn btn-primary">
              Request New Link
            </a>
          </div>
        </div>
      </div>
    );
  }

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

        <h2 className="card-title text-2xl">Reset Password</h2>
        <p className="text-base-content/70">
          Create a new password for your account.
        </p>

        {isSuccess ? (
          <div className="mt-6 space-y-4">
            <div className="alert alert-success">
              <CheckCircle className="h-5 w-5" />
              <span>
                Your password has been reset successfully! You will be
                redirected to the login page.
              </span>
            </div>
            <div className="card-actions mt-4">
              <a href="/login" className="btn btn-primary w-full">
                Go to Login
              </a>
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

            {/* Password field */}
            <div className="fieldset w-full mt-4">
              <label className="fieldset-legend" htmlFor="password">
                <span className="label-text">New Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full pr-10 ${
                    validationErrors.password ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
              {validationErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.password.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="fieldset w-full mt-2">
              <label className="fieldset-legend" htmlFor="confirmPassword">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input input-bordered w-full pr-10 ${
                    validationErrors.confirmPassword ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.confirmPassword[0]}
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
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
