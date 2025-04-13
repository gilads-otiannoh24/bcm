"use client";

import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
import api from "../lib/axios";

// Define the contact form schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  // Form state
  const [formData, setFormData] = useState<ContactFormInputs>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
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
      contactFormSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format and set validation errors
        const errors = err.format() as any;
        setValidationErrors({
          name: errors.name?._errors,
          email: errors.email?._errors,
          subject: errors.subject?._errors,
          message: errors.message?._errors,
        });
        return;
      }
    }

    // If validation passes, submit the form
    try {
      setIsLoading(true);

      const response = await api.post("/users/contactus", formData);

      if (response.data.success) {
        // Show success message
        setIsSuccess(true);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      if (err.status === 400) {
        setError(err.response.data.error);
      } else {
        setError("Failed to send message. Please try again later.");
        console.error("Contact form error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
          <p className="text-center mb-6">
            Thank you for reaching out. We've received your message and will get
            back to you as soon as possible.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsSuccess(false)}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Show error if any */}
          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name field */}
            <div className="form-control w-full">
              <label className="label" htmlFor="name">
                <span className="label-text">Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={`input input-bordered w-full ${
                  validationErrors.name ? "input-error" : ""
                }`}
                disabled={isLoading}
              />
              {validationErrors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.name[0]}
                  </span>
                </label>
              )}
            </div>

            {/* Email field */}
            <div className="form-control w-full">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
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
                    {validationErrors.email[0]}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Subject field */}
          <div className="form-control w-full mb-6">
            <label className="label" htmlFor="subject">
              <span className="label-text">Subject</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is your message about?"
              value={formData.subject}
              onChange={handleChange}
              className={`input input-bordered w-full ${
                validationErrors.subject ? "input-error" : ""
              }`}
              disabled={isLoading}
            />
            {validationErrors.subject && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validationErrors.subject[0]}
                </span>
              </label>
            )}
          </div>

          {/* Message field */}
          <div className="form-control w-full mb-6">
            <label className="label" htmlFor="message">
              <span className="label-text">Message</span>
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              className={`textarea textarea-bordered w-full h-32 ${
                validationErrors.message ? "textarea-error" : ""
              }`}
              disabled={isLoading}
            />
            {validationErrors.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validationErrors.message[0]}
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto md:px-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
