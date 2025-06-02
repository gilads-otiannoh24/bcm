"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// Define the login form schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Define the form input types
type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  // Form state
  const [formData, setFormData] = useState<LoginFormInputs>({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  const [canLogin, setCanLogin] = useState(false);

  const { login, user, checkAuth } = useAuth();

  const validationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear previous timeout
    if (validationTimeout.current) {
      clearTimeout(validationTimeout.current);
    }

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Set new validation timeout
    validationTimeout.current = setTimeout(() => {
      validateForm(name as "email" | "password", value);

      try {
        loginSchema.parse({ ...formData, [name]: value }); // ensure current field is included
        setCanLogin(true);
      } catch (error) {
        setCanLogin(false);
      }
    }, 300);

    if (loginError) {
      setLoginError(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (validationTimeout.current) {
        clearTimeout(validationTimeout.current);
      }
    };
  }, []);

  const validateForm = (
    name: null | "email" | "password" = null,
    value: string = ""
  ): boolean => {
    try {
      let data = formData;

      if (name) {
        data = { ...data, [name]: value };
      }

      loginSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format and set validation errors
        const errors = error.format() as any;

        if (name) {
          setValidationErrors((prev) => ({
            ...prev,
            [name]: errors[name]?._errors,
          }));
          return false;
        }

        setValidationErrors({
          email: errors.email?._errors,
          password: errors.password?._errors,
        });
        return false;
      }

      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setValidationErrors({});
    setLoginError(null);

    if (!validateForm) return;

    // If validation passes, attempt login
    try {
      setIsLoading(true);

      const response = await login(formData);

      await checkAuth();

      if (response.data.success) {
        if (user?.role === "admin") {
          window.location.href = "/cards";
        } else {
          window.location.href = "/browse";
        }
      } else {
        // Failed login
        setLoginError(response.data.message);
      }
    } catch (error: any) {
      if (error.status === 401) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError("An error occurred. Please try again later.");
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">Login</h2>
        <p className="text-base-content/70">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit}>
          {/* Show login error if any */}
          {loginError && (
            <div className="alert alert-error mt-4">
              <span>{loginError}</span>
            </div>
          )}

          <div className="fieldset w-full mt-4">
            {/* Email field */}
            <label className="fieldset-legend" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`input w-full ${
                validationErrors.email ? "input-error" : ""
              }`}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validationErrors.email[0]}
                </span>
              </label>
            )}
          </div>

          {/* Password field */}
          <div className="fieldset w-full mt-2">
            <label className="fieldset-legend" htmlFor="password">
              <span className="label-text">Password</span>
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
                  {validationErrors.password[0]}
                </span>
              </label>
            )}
          </div>

          <div className="card-actions mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full`}
              disabled={isLoading || !canLogin}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>
          <div className="text-center mt-4 text-sm">
            Dont have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
          <div className="text-center mt-2 text-sm">
            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
