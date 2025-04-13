"use client";

import type React from "react";

import { useState } from "react";
import {
  X,
  Save,
  Loader2,
  User,
  Building,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";
import { z } from "zod";
import api from "../../lib/axios";
import { UserProfile } from "./user-profile";

// Define props for the component
interface ProfileEditModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
}

// Define the profile update schema with Zod
const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  bio: z
    .string()
    .max(500, { message: "Bio cannot exceed 500 characters" })
    .optional(),
  socialLinks: z.object({
    linkedin: z
      .string()
      .url({ message: "Please enter a valid URL" })
      .optional()
      .or(z.literal("")),
    twitter: z
      .string()
      .url({ message: "Please enter a valid URL" })
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url({ message: "Please enter a valid URL" })
      .optional()
      .or(z.literal("")),
  }),
});

export function ProfileEditModal({
  user,
  onClose,
  onSave,
}: ProfileEditModalProps) {
  // Form state
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("socialLinks.")) {
      const socialKey = name.split(".")[1] as "linkedin" | "twitter" | "github";
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Validate form data
      profileUpdateSchema.parse(formData);

      const response = await api.patch("/auth/updatedetails", formData);

      if (response.data.success) {
        onSave(formData);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format validation errors
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const path = error.path.join(".");
          errors[path] = error.message;
        });
        setValidationErrors(errors);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while updating profile"
        );
      }
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
        <h3 className="font-bold text-lg mb-4">Edit Profile</h3>

        {/* Show error if any */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors["name"] ? "input-error" : ""
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {validationErrors["name"] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors["name"]}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors["email"] ? "input-error" : ""
                  }`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {validationErrors["email"] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors["email"]}
                  </span>
                </label>
              )}
            </div>

            {/* Job Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Job Title</span>
              </label>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Product Manager"
                />
              </div>
            </div>

            {/* Company */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Company</span>
              </label>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Acme Inc."
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Bio</span>
              <span className="label-text-alt">
                {formData.bio?.length || 0}/500
              </span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`textarea textarea-bordered w-full h-32 ${
                validationErrors["bio"] ? "textarea-error" : ""
              }`}
              placeholder="Tell us about yourself..."
            />
            {validationErrors["bio"] && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validationErrors["bio"]}
                </span>
              </label>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Social Links</h4>

            {/* LinkedIn */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">LinkedIn</span>
              </label>
              <div className="flex items-center">
                <Linkedin className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin || ""}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors["socialLinks.linkedin"]
                      ? "input-error"
                      : ""
                  }`}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              {validationErrors["socialLinks.linkedin"] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors["socialLinks.linkedin"]}
                  </span>
                </label>
              )}
            </div>

            {/* Twitter */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Twitter</span>
              </label>
              <div className="flex items-center">
                <Twitter className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter || ""}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors["socialLinks.twitter"] ? "input-error" : ""
                  }`}
                  placeholder="https://twitter.com/username"
                />
              </div>
              {validationErrors["socialLinks.twitter"] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors["socialLinks.twitter"]}
                  </span>
                </label>
              )}
            </div>

            {/* GitHub */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">GitHub</span>
              </label>
              <div className="flex items-center">
                <Github className="h-5 w-5 mr-2 text-base-content/50" />
                <input
                  type="url"
                  name="socialLinks.github"
                  value={formData.socialLinks.github || ""}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${
                    validationErrors["socialLinks.github"] ? "input-error" : ""
                  }`}
                  placeholder="https://github.com/username"
                />
              </div>
              {validationErrors["socialLinks.github"] && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors["socialLinks.github"]}
                  </span>
                </label>
              )}
            </div>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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
