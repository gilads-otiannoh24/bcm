import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// Define the registration form schema with Zod
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
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
type RegisterFormInputs = z.infer<typeof registerSchema>;

export function RegisterForm() {
  // Form state
  const [formData, setFormData] = useState<RegisterFormInputs>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: { _errors: string[] };
    lastName?: { _errors: string[] };
    email?: { _errors: string[] };
    password?: { _errors: string[] };
    confirmPassword?: { _errors: string[] };
  }>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { register } = useAuth();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear register error when user types
    if (registerError) {
      setRegisterError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setValidationErrors({});
    setRegisterError(null);

    // Validate form data
    try {
      registerSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format and set validation errors
        const errors = error.format() as any;

        setValidationErrors({
          firstName: errors.firstName,
          lastName: errors.lastName,
          email: errors.email,
          password: errors.password,
          confirmPassword: errors.confirmPassword,
        });
        return;
      }
    }

    // If validation passes, attempt registration
    try {
      setIsLoading(true);

      const response = await register(formData);

      if (!response.data.success) {
        setRegisterError(response.data.message);
      } else {
        setRegistrationSuccess(true);

        setTimeout(() => {
          window.location.href = "/cards";
        }, 2000);
      }
    } catch (error) {
      setRegisterError("An error occurred. Please try again later.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">Create an Account</h2>
        <p className="text-base-content/70">
          Sign up to get started with our service
        </p>

        {registrationSuccess ? (
          <div className="alert alert-success mt-4">
            <span>Registration successful! Redirecting to my cards...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Show registration error if any */}
            {registerError && (
              <div className="alert alert-error mt-4">
                <span>{registerError}</span>
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* First Name field */}
              <div className="fieldset w-full">
                <label className="fieldset-legend" htmlFor="firstName">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors.firstName ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
                {validationErrors.firstName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {validationErrors.firstName?._errors[0]}
                    </span>
                  </label>
                )}
              </div>

              {/* Last Name field */}
              <div className="fieldset w-full">
                <label className="fieldset-legend" htmlFor="lastName">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors.lastName ? "input-error" : ""
                  }`}
                  disabled={isLoading}
                />
                {validationErrors.lastName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {validationErrors.lastName?._errors[0]}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Email field */}
            <div className="fieldset w-full mt-2">
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
                className={`input input-bordered w-full ${
                  validationErrors.email ? "input-error" : ""
                }`}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.email?._errors[0]}
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
                    {validationErrors.password?._errors.map((error, index) => (
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
                    {validationErrors.confirmPassword?._errors[0]}
                  </span>
                </label>
              )}
            </div>

            <div className="card-actions mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>

            <div className="text-center mt-4 text-sm">
              Already have an account?{" "}
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
