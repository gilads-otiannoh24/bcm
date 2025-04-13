"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Save, X } from "lucide-react";
import api from "../../lib/axios";

type UserCreateModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export function UserCreateModal({ onClose, onSuccess }: UserCreateModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Optional now
    role: "user",
    status: "active",
    jobTitle: "",
    company: "",
    location: "",
    phone: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatePassword, setGeneratePassword] = useState(true);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name === "generatePassword") {
      setGeneratePassword(checked);
      // Clear password field when switching to auto-generate
      if (checked) {
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/users", formData);

      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="font-bold text-lg mb-4">Create New User</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="user">User</option>
                <option value="premium">Premium</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Job Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Job Title</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Company */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Company</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Auto-generate password checkbox */}
            <div className="form-control md:col-span-2">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  name="generatePassword"
                  checked={generatePassword}
                  onChange={handleCheckboxChange}
                  className="checkbox checkbox-primary mr-2"
                />
                <span className="label-text">
                  Auto-generate password and send to user's email
                </span>
              </label>
            </div>

            {/* Password field - only shown if not auto-generating */}
            {!generatePassword && (
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full pr-10"
                    required={!generatePassword}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
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
                <label className="label">
                  <span className="label-text-alt">
                    Password will still be sent to the user's email for
                    confirmation.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
