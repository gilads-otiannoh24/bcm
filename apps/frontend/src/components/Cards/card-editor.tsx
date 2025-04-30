"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Check,
} from "lucide-react";
import { CardPreview } from "./card-preview";
import { ConfirmModal } from "./confirm-modal";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import useToastStore from "../../hooks/useToast";
import { BusinessCard, CardTemplate } from "@shared/types";

// Template options
const templateOptions: {
  value: CardTemplate;
  label: string;
  description: string;
}[] = [
  {
    value: "professional",
    label: "Professional",
    description: "Clean and corporate design ideal for traditional businesses",
  },
  {
    value: "creative",
    label: "Creative",
    description:
      "Unique and artistic design perfect for creative professionals",
  },
  {
    value: "minimal",
    label: "Minimal",
    description:
      "Simple and elegant design with focus on essential information",
  },
  {
    value: "bold",
    label: "Bold",
    description: "Strong and impactful design that makes a statement",
  },
  {
    value: "elegant",
    label: "Elegant",
    description: "Sophisticated and refined design for a premium feel",
  },
];

// Color options
const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "black", label: "Black", class: "bg-black" },
  { value: "gray", label: "Gray", class: "bg-gray-500" },
  { value: "gold", label: "Gold", class: "bg-yellow-500" },
];

type CardEditorProps = {
  cardId: string;
};

export function CardEditor({ cardId }: CardEditorProps) {
  // State for card data
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "design" | "preview">(
    "info"
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToastStore();

  // Fetch card data
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await api.get(`/businesscards/${cardId}`);

        if (response.data.success) {
          setCard(response.data.data);
        } else {
          setCard(null);
        }
      } catch (err: any) {
        if (err.status === 404) {
          setCard(null);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!card) return;

    const { name, value } = e.target;
    setCard({ ...card, [name]: value });
  };

  // Handle template selection
  const handleTemplateSelect = (template: CardTemplate) => {
    if (!card) return;
    setCard({ ...card, template });
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    if (!card) return;
    setCard({ ...card, color });
  };

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!card) return;
    setCard({
      ...card,
      status: e.target.value as "active" | "inactive" | "draft",
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!card) return;

    try {
      setIsSaving(true);
      const res = await api.patch(`businesscards/${cardId}`, card);

      if (res.data.success) {
        toast.success("Card updated successfully");

        setTimeout(() => {
          return navigate("/cards");
        }, 2000);
      }
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await api.delete(`businesscards/${cardId}`);

      if (res.data.success) {
        toast.success("Card deleted successfully!");
        return navigate("/cards");
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("Card not found!");
      }
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="bg-base-100 p-8 rounded-lg shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-base-200 p-4 rounded-full">
            <CreditCard className="h-8 w-8 text-base-content/50" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Card not found</h3>
        <p className="text-base-content/70 mb-6">
          The business card you're looking for doesn't exist or has been
          deleted.
        </p>
        <button className="btn btn-primary" onClick={() => {}}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Cards
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-xl">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="btn btn-ghost btn-sm mr-4"
            onClick={() => navigate("/cards")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h2 className="text-xl font-bold">{card.title}</h2>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-error btn-sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button
            disabled={isSaving}
            className="btn btn-primary btn-sm"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Saving <span className="loading loading-spinner"></span>
              </>
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b">
        <div className="tabs">
          <button
            className={`tab tab-bordered ${
              activeTab === "info" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            Information
          </button>
          <button
            className={`tab tab-bordered ${
              activeTab === "design" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={`tab tab-bordered ${
              activeTab === "preview" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Information Tab */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">
                      Card Title (for your reference)
                    </span>
                  </label>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="title"
                      value={card.title}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="My Business Card"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Full Name</span>
                  </label>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="name"
                      value={card.name}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Job Title</span>
                  </label>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="jobTitle"
                      value={card.jobTitle}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Product Manager"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Company</span>
                  </label>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="company"
                      value={card.company}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Email</span>
                  </label>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="email"
                      name="email"
                      value={card.email}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Phone</span>
                  </label>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="phone"
                      value={card.phone}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Website (optional)</span>
                  </label>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="website"
                      value={card.website}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>

                <div className="fieldset">
                  <label className="fieldset-legend">
                    <span className="label-text">Address (optional)</span>
                  </label>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-base-content/50" />
                    <input
                      type="text"
                      name="address"
                      value={card.address}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="fieldset">
              <label className="fieldset-legend">
                <span className="label-text">Card Status</span>
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={card.status}
                onChange={handleStatusChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <label className="label">
                <span className="label-text-alt">
                  {card.status === "active"
                    ? "Card is visible and can be shared"
                    : card.status === "inactive"
                    ? "Card is hidden but can be reactivated"
                    : "Card is not finalized and only visible to you"}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Design Tab */}
        {activeTab === "design" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-3">Template</h3>
                <div className="grid grid-cols-1 gap-4">
                  {templateOptions.map((template) => (
                    <div
                      key={template.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        card.template === template.value
                          ? "border-primary bg-primary/5"
                          : "hover:border-base-300"
                      }`}
                      onClick={() => handleTemplateSelect(template.value)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{template.label}</h3>
                        {card.template === template.value && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-base-content/70">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Color Scheme</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${
                        color.class
                      } ${
                        card.color === color.value
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                      onClick={() => handleColorSelect(color.value)}
                      title={color.label}
                    >
                      {card.color === color.value && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="font-medium mb-3">Preview</h3>
                <div className="border rounded-lg p-4 bg-base-200">
                  <div className="aspect-video max-w-md mx-auto">
                    <CardPreview card={card} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h3 className="font-medium mb-3">Card Preview</h3>
                <div className="border rounded-lg p-4 bg-base-200">
                  <div className="aspect-video max-w-md mx-auto">
                    <CardPreview card={card} />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Card Statistics</h3>
                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                      <div className="stat-title">Views</div>
                      <div className="stat-value">{card.views}</div>
                      <div className="stat-desc">Since creation</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Shares</div>
                      <div className="stat-value">{card.shares}</div>
                      <div className="stat-desc">Since creation</div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Created</div>
                      <div className="stat-value text-lg">{card.createdAt}</div>
                      <div className="stat-desc">
                        Last updated: {card.updatedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-medium mb-3">Card Information</h3>
                <div className="border rounded-lg p-4">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Template:</dt>
                      <dd className="font-medium">
                        {card.template.charAt(0).toUpperCase() +
                          card.template.slice(1)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Color:</dt>
                      <dd className="font-medium">
                        {card.color.charAt(0).toUpperCase() +
                          card.color.slice(1)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Status:</dt>
                      <dd className="font-medium">
                        <span
                          className={`badge ${
                            card.status === "active"
                              ? "badge-success"
                              : card.status === "inactive"
                              ? "badge-warning"
                              : "badge-ghost"
                          }`}
                        >
                          {card.status.charAt(0).toUpperCase() +
                            card.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Name:</dt>
                      <dd className="font-medium">{card.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Job Title:</dt>
                      <dd className="font-medium">{card.jobTitle}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Company:</dt>
                      <dd className="font-medium">{card.company}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Email:</dt>
                      <dd className="font-medium">{card.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Phone:</dt>
                      <dd className="font-medium">{card.phone}</dd>
                    </div>
                    {card.website && (
                      <div className="flex justify-between">
                        <dt className="text-base-content/70">Website:</dt>
                        <dd className="font-medium">{card.website}</dd>
                      </div>
                    )}
                    {card.address && (
                      <div className="flex justify-between">
                        <dt className="text-base-content/70">Address:</dt>
                        <dd className="font-medium">{card.address}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex justify-between">
        <button className="btn btn-outline" onClick={() => navigate("/cards")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </button>

        <div className="flex gap-2">
          <button className="btn btn-error" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button
            disabled={isSaving}
            className="btn btn-primary"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? (
              <>
                Saving <span className="loading loading-spinner"></span>
              </>
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmModal
          title="Delete Business Card"
          message={`Are you sure you want to delete "${card.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
