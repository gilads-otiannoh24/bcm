"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  X,
  UserRoundSearch,
} from "lucide-react";
import { CardPreview } from "./card-preview";
import type { CardTemplate } from "./my-cards";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import useToastStore from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import { User as UserType } from "@shared/types";

// Define the form data type
type CardFormData = {
  title: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  template: CardTemplate;
  color: string;
  userId?: string;
};

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

export function CardCreator() {
  // Define steps
  const steps = ["Template", "Design", "Information", "Preview"];
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchDebounce, setSearchDebounce] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [searchingUsers, setSearchingUsers] = useState(true);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToastStore();
  const { user } = useAuth();

  // Form data state
  const [formData, setFormData] = useState<CardFormData>({
    title: "My Business Card",
    name: "Your Name",
    jobTitle: "Your Job Title",
    company: "Your Company",
    email: "your.email@example.com",
    phone: "(555) 123-4567",
    website: "www.yourwebsite.com",
    address: "Your Location",
    template: "professional",
    color: "blue",
    userId: user?.id ?? "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setUserSearchQuery(value);

    if (searchDebounce !== null) {
      clearTimeout(searchDebounce);
    }

    setSearchDebounce(
      setTimeout(async () => {
        await seachForUsers();
      }, 500)
    );
  };

  const seachForUsers = async () => {
    try {
      setSearchingUsers(true);
      const res = await api.get(`/users?search=${userSearchQuery}`);

      if (res.status === 200) {
        setFilteredUsers(res.data.data);
      }
    } catch (error: any) {
      toast.error("An error occured while searching for users");
    } finally {
      setSearchingUsers(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: CardTemplate) => {
    setFormData((prev) => ({ ...prev, template }));
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/businesscards", formData);

      if (res.data.success) {
        toast.success("Business card created successfully");
        return navigate("/cards");
      }
    } catch (error: any) {
      if (error.status === 400) {
        return toast.error("Invalid input");
      }
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-xl">
      {/* Progress Steps */}
      <div className="p-4 border-b">
        <ul className="steps steps-horizontal w-full">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`step ${index <= currentStep ? "step-primary" : ""}`}
              onClick={() => setCurrentStep(index)}
            >
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6">
        {/* Step 1: Template Selection */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Choose a Template</h2>
            <p className="text-base-content/70">
              Select a template that best represents your professional identity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {templateOptions.map((template) => (
                <div
                  key={template.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.template === template.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-base-300"
                  }`}
                  onClick={() => handleTemplateSelect(template.value)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{template.label}</h3>
                    {formData.template === template.value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-base-content/70">
                    {template.description}
                  </p>
                  <div className="mt-4 h-24 bg-base-200 rounded flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-base-content/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Design Customization */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Customize Design</h2>
            <p className="text-base-content/70">
              Choose colors and styling for your business card.
            </p>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Color Scheme</h3>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center ${
                      color.class
                    } ${
                      formData.color === color.value
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleColorSelect(color.value)}
                    title={color.label}
                  >
                    {formData.color === color.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Preview</h3>
              <div className="border rounded-lg p-4 bg-base-200">
                <div className="aspect-video max-w-md mx-auto">
                  <CardPreview card={formData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Enter Your Information</h2>
            <p className="text-base-content/70">
              Add your personal and professional details to your business card.
            </p>

            <form className="mt-6 space-y-4">
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
                    value={formData.title}
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
                    value={formData.name}
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
                    value={formData.jobTitle}
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
                    value={formData.company}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="fieldset">
                <label className="fieldset-legend">
                  <span className="label-text">Email</span>
                </label>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-base-content/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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
                    value={formData.phone}
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
                    value={formData.website}
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
                    value={formData.address}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="fieldset hidden">
                <label className="fieldset-legend">
                  <span className="label-text">
                    User{" "}
                    <span className="dark:text-gray-400 text-gray-200">
                      (Use name or email to search for a user)
                    </span>
                  </span>
                </label>
                <div className="flex items-center">
                  <UserRoundSearch className="h-5 w-5 mr-2 text-base-content/50" />
                  <label className="input w-full">
                    {selectedUser && (
                      <span className="badge badge-primary">
                        {selectedUser?.firstName}
                        <span className="badge ml-2 badge-sm badge-secondary">
                          {selectedUser?.email}
                        </span>
                      </span>
                    )}
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={handleUserSearch}
                      className="grow"
                      disabled={selectedUser !== null}
                      placeholder="Enter name or email to search"
                    />

                    {(userSearchQuery || selectedUser) && (
                      <span
                        onClick={() => {
                          setUserSearchQuery("");
                          setSelectedUser(null);
                          formData.userId = "";
                        }}
                        className="bg-primary p-1 cursor-pointer rounded-full text-white"
                      >
                        <X className="size-4" />
                      </span>
                    )}
                  </label>
                </div>
                {userSearchQuery && (
                  <div className="mt-2 p-2 w-full bg-base-300 space-y-2">
                    {searchingUsers ? (
                      <div className="py-12 flex items-center justify-center">
                        <div className="loading loading-spinner text-primary"></div>
                      </div>
                    ) : (
                      <>
                        {filteredUsers.map((user) => (
                          <div
                            className="p-4 hover:bg-gray-200 hover:dark:bg-gray-800 flex items-center justify-between max-w-xl w-full"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserSearchQuery("");
                              formData.userId = user.id;
                            }}
                            key={user.id}
                          >
                            <span>{user.fullName}</span>
                            <span className="text-secondary-content">
                              {user.email}
                            </span>
                          </div>
                        ))}

                        {filteredUsers.length === 0 && (
                          <div>No matching results found</div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Preview Your Business Card</h2>
            <p className="text-base-content/70">
              Review your business card before saving it.
            </p>

            <div className="mt-6 flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h3 className="font-medium mb-3">Card Preview</h3>
                <div className="border rounded-lg p-4 bg-base-200">
                  <div className="aspect-video max-w-md mx-auto">
                    <CardPreview card={formData} />
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
                        {formData.template.charAt(0).toUpperCase() +
                          formData.template.slice(1)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Color:</dt>
                      <dd className="font-medium">
                        {formData.color.charAt(0).toUpperCase() +
                          formData.color.slice(1)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Name:</dt>
                      <dd className="font-medium">{formData.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Job Title:</dt>
                      <dd className="font-medium">{formData.jobTitle}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Company:</dt>
                      <dd className="font-medium">{formData.company}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Email:</dt>
                      <dd className="font-medium">{formData.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-base-content/70">Phone:</dt>
                      <dd className="font-medium">{formData.phone}</dd>
                    </div>
                    {formData.website && (
                      <div className="flex justify-between">
                        <dt className="text-base-content/70">Website:</dt>
                        <dd className="font-medium">{formData.website}</dd>
                      </div>
                    )}
                    {formData.address && (
                      <div className="flex justify-between">
                        <dt className="text-base-content/70">Address:</dt>
                        <dd className="font-medium">{formData.address}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="p-6 border-t flex justify-between">
        <button
          className="btn btn-outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {currentStep < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Card
          </button>
        )}
      </div>
    </div>
  );
}
