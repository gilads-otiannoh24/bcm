"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Globe,
  Key,
  Mail,
  Moon,
  Palette,
  Save,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import api from "../../lib/axios";
import useToastStore from "../../hooks/useToast";
import Button from "../Button";
import { Theme, useAuth } from "../../context/AuthContext";
import { User as TypeUser } from "@shared/types";
import { z } from "zod";
import { getTheme } from "../ThemeToggle";
import { useNavigate } from "react-router-dom";

type AppearanceSettings = {
  theme: "light" | "dark" | "system";
  cardDisplayMode: "grid" | "list";
  language: "en" | "es" | "fr";
};

type CardSettings = {
  defaultTemplate: "Professional" | "Minimal" | "Bold" | "Creative" | "Elegant";
  autoShareWithConnections: boolean;
  requireApprovalBeforeSharing: boolean;
  showCardAnalytics: boolean;
};

type UserSettings = {
  appearance: AppearanceSettings;
  cards: CardSettings;
};

export type ServerSettings = {
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr";
  cardLayout: "grid" | "list";
  cardTemplate: "Professional" | "Minimal" | "Bold" | "Creative" | "Elegant";
  autoShareCardsWithConnections: boolean;
  requireApprovalBeforeSharing: boolean;
  showCardAnalytics: boolean;
};

// Language options
const languages = [{ value: "en", label: "English" }];

// Card template options
const cardTemplates = [
  { value: "Professional", label: "Professional" },
  { value: "Creative", label: "Creative" },
  { value: "Minimal", label: "Minimal" },
  { value: "Bold", label: "Bold" },
  { value: "Elegant", label: "Elegant" },
];

const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z
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
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [activeTab, setActiveTab] = useState<
    "account" | "appearance" | "cards"
  >("account");
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordUpdateValidationErrors, setPasswordUpdateValidationErrors] =
    useState<{
      currentPassword?: { _errors: string[] };
      newPassword?: { _errors: string[] };
      confirmPassword?: { _errors: string[] };
    }>({});

  const [deletionReason, setDeletionReason] = useState("");
  const [deletionPassword, setDeletionPassword] = useState("");

  const { toast } = useToastStore();
  const { user, setUser, setTheme } = useAuth();
  const navigate = useNavigate();

  const [passwordUpdateFormData, setPasswordUpdateFormData] =
    useState<PasswordUpdate>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const { getUserSettings } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await getUserSettings();

      if (response.data.success) {
        const settings = response.data.data;

        setSettings(formatSettingsToCLientTypes(settings));
      }
    };

    fetchSettings();
  }, []);

  const formatSettingsToCLientTypes = (data: ServerSettings): UserSettings => {
    return {
      appearance: {
        theme: data.theme,
        language: data.language,
        cardDisplayMode: data.cardLayout,
      },
      cards: {
        defaultTemplate: data.cardTemplate,
        autoShareWithConnections: data.autoShareCardsWithConnections,
        requireApprovalBeforeSharing: data.requireApprovalBeforeSharing,
        showCardAnalytics: data.showCardAnalytics,
      },
    };
  };

  const formatSettingsToServerTypes = (data: UserSettings): ServerSettings => {
    return {
      theme: data.appearance.theme,
      language: data.appearance.language,
      cardLayout: data.appearance.cardDisplayMode,
      cardTemplate: data.cards.defaultTemplate,
      autoShareCardsWithConnections: data.cards.autoShareWithConnections,
      requireApprovalBeforeSharing: data.cards.requireApprovalBeforeSharing,
      showCardAnalytics: data.cards.showCardAnalytics,
    };
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordUpdateFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user types
    if (
      passwordUpdateValidationErrors[
        name as keyof typeof passwordUpdateValidationErrors
      ]
    ) {
      setPasswordUpdateValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle toggle changes
  const handleToggleChange = (
    section: "appearance" | "cards",
    setting: string,
    checked: boolean
  ) => {
    //  @ts-ignore
    setSettings((prev) => ({
      ...prev,
      [section]: {
        //  @ts-ignore

        ...prev[section],
        [setting]: checked,
      },
    }));

    // Clear success message when settings change
    if (saveSuccess) setSaveSuccess(false);
  };

  // Handle select changes
  const handleSelectChange = (
    section: "appearance" | "cards",
    setting: string,
    value: string
  ) => {
    //  @ts-ignore
    setSettings((prev) => ({
      ...prev,
      [section]: {
        //  @ts-ignore
        ...prev[section],
        [setting]: value,
      },
    }));

    if (setting === "theme") {
      setTheme(getTheme(value as Theme));
    }

    // Clear success message when settings change
    if (saveSuccess) setSaveSuccess(false);
  };

  // Save settings
  const saveSettings = async () => {
    try {
      const res = await api.patch(
        "/settings/updatedetails",
        formatSettingsToServerTypes(settings as UserSettings)
      );

      if (res.data.success) {
        setSaveSuccess(true);
      }
    } catch (error: any) {
      toast.error("Failed to save settings");
    } finally {
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  // Handle email change
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    let emailError = true;

    try {
      setIsChangingEmail(true);
      const res = await api.patch("/auth/updatedetails", { email: newEmail });

      if (res.data.success) {
        toast.success("Email updated successfully!");
        const updatedUser = res.data.data as TypeUser;

        setUser(updatedUser);
        setNewEmail("");
        emailError = false;
      }
    } catch (err: any) {
      if (err.response.status === 400) {
        toast.error("Email already exists");
      }
    } finally {
      if (!emailError) {
        setChangeEmail(false);
      }
      setIsChangingEmail(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordUpdateValidationErrors({});

    try {
      passwordUpdateSchema.parse(passwordUpdateFormData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format and set validation errors
        const errors = error.format() as any;

        setPasswordUpdateValidationErrors({
          currentPassword: errors.currentPassword,
          newPassword: errors.newPassword,
          confirmPassword: errors.confirmPassword,
        });
        return;
      }
    }

    let IsError = true;
    try {
      setIsChangingPassword(true);
      const res = await api.patch(
        "/auth/updatepassword",
        passwordUpdateFormData
      );

      if (res.data.success) {
        toast.success("Password updated successfully!");
        resetPasswordUpdateData();
        IsError = false;
      }
    } catch (error: any) {
      if ((error.response.status = 400)) {
        toast.error("Incorrect password provided!");
        setPasswordUpdateValidationErrors((prev) => ({
          ...prev,
          currentPassword: { _errors: ["Incorrect password provided!"] },
        }));
      }
    } finally {
      if (!IsError) {
        setChangePassword(false);
      }
      setIsChangingPassword(false);
    }
  };

  const resetPasswordUpdateData = () => {
    setPasswordUpdateFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const res = await api.post("/auth/deleteaccount", {
        reason: deletionReason,
        password: deletionPassword,
      });

      if (res.data.success) {
        toast.success("Account deleted successfully!");
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to delete account!");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "password") {
      setDeletionPassword(value);
    }
    if (name === "reason") {
      setDeletionReason(value);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="md:w-64">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <h2 className="card-title text-xl mb-4">Settings</h2>
              <ul className="menu bg-base-100 w-full p-0">
                <li className={activeTab === "account" ? "bordered" : ""}>
                  <button
                    className="flex items-center gap-3"
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="h-4 w-4" />
                    Account
                  </button>
                </li>
                <li className={activeTab === "appearance" ? "bordered" : ""}>
                  <button
                    className="flex items-center gap-3"
                    onClick={() => setActiveTab("appearance")}
                  >
                    <Palette className="h-4 w-4" />
                    Appearance
                  </button>
                </li>
                <li className={activeTab === "cards" ? "bordered" : ""}>
                  <button
                    className="flex items-center gap-3"
                    onClick={() => setActiveTab("cards")}
                  >
                    <CreditCard className="h-4 w-4" />
                    Business Cards
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {/* Success Message */}
          {saveSuccess && (
            <div className="alert alert-success mb-6">
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Account Settings</h2>

                {/* Email Settings */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Email Address</h3>

                  {!changeEmail ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{user?.email}</span>
                      </div>
                      <Button
                        className="btn-sm btn-outline"
                        onClick={() => setChangeEmail(true)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailChange} className="space-y-4">
                      <div className="fieldset w-full">
                        <label className="fieldset-legend">
                          <span className="label-text">New Email Address</span>
                        </label>
                        <input
                          type="email"
                          className="input input-bordered w-full"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setChangeEmail(false);
                            setNewEmail("");
                          }}
                        >
                          Cancel
                        </button>
                        <Button
                          isLoading={isChangingEmail}
                          type="submit"
                          className="btn btn-primary"
                        >
                          Update Email
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="divider"></div>

                {/* Password Settings */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Password</h3>

                  {!changePassword ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        <span>••••••••••••</span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setChangePassword(true)}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="fieldset w-full">
                        <label className="fieldset-legend">
                          <span className="label-text">Current Password</span>
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordUpdateFormData.currentPassword}
                          onChange={handlePasswordInputChange}
                          className={`input input-bordered w-full ${
                            passwordUpdateValidationErrors.currentPassword
                              ? "input-error"
                              : ""
                          }`}
                          required
                        />
                        {passwordUpdateValidationErrors.currentPassword && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {
                                passwordUpdateValidationErrors.currentPassword
                                  ?._errors[0]
                              }
                            </span>
                          </label>
                        )}
                      </div>
                      <div className="fieldset w-full">
                        <label className="fieldset-legend">
                          <span className="label-text">New Password</span>
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordUpdateFormData.newPassword}
                          onChange={handlePasswordInputChange}
                          className={`input input-bordered w-full ${
                            passwordUpdateValidationErrors.newPassword
                              ? "input-error"
                              : ""
                          }`}
                          required
                        />
                        {passwordUpdateValidationErrors.newPassword && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {
                                passwordUpdateValidationErrors.newPassword
                                  ?._errors[0]
                              }
                            </span>
                          </label>
                        )}
                      </div>
                      <div className="fieldset w-full">
                        <label className="fieldset-legend">
                          <span className="label-text">
                            Confirm New Password
                          </span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordUpdateFormData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className={`input input-bordered w-full ${
                            passwordUpdateValidationErrors.confirmPassword
                              ? "input-error"
                              : ""
                          }`}
                          required
                        />
                        {passwordUpdateValidationErrors.confirmPassword && (
                          <label className="label">
                            <span className="label-text-alt text-error">
                              {
                                passwordUpdateValidationErrors.confirmPassword
                                  ?._errors[0]
                              }
                            </span>
                          </label>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => {
                            setChangePassword(false);
                            resetPasswordUpdateData();
                          }}
                        >
                          Cancel
                        </button>
                        <Button
                          isLoading={isChangingPassword}
                          type="submit"
                          className="btn btn-primary"
                        >
                          Update Password
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="divider"></div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-error">
                    Danger Zone
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-base-content/70">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Appearance</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Theme</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        className="radio radio-primary"
                        checked={settings?.appearance.theme === "light"}
                        onChange={() =>
                          handleSelectChange("appearance", "theme", "light")
                        }
                      />
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        className="radio radio-primary"
                        checked={settings?.appearance.theme === "dark"}
                        onChange={() =>
                          handleSelectChange("appearance", "theme", "dark")
                        }
                      />
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        className="radio radio-primary"
                        checked={settings?.appearance.theme === "system"}
                        onChange={() =>
                          handleSelectChange("appearance", "theme", "system")
                        }
                      />
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Card Display Mode
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cardDisplayMode"
                        className="radio radio-primary"
                        checked={
                          settings?.appearance.cardDisplayMode === "grid"
                        }
                        onChange={() =>
                          handleSelectChange(
                            "appearance",
                            "cardDisplayMode",
                            "grid"
                          )
                        }
                      />
                      <span>Grid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="cardDisplayMode"
                        className="radio radio-primary"
                        checked={
                          settings?.appearance.cardDisplayMode === "list"
                        }
                        onChange={() =>
                          handleSelectChange(
                            "appearance",
                            "cardDisplayMode",
                            "list"
                          )
                        }
                      />
                      <span>List</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Language</h3>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={settings?.appearance.language}
                    onChange={(e) =>
                      handleSelectChange(
                        "appearance",
                        "language",
                        e.target.value
                      )
                    }
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-primary" onClick={saveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card Settings */}
          {activeTab === "cards" && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">
                  Business Card Settings
                </h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Default Card Template
                  </h3>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={settings?.cards.defaultTemplate}
                    onChange={(e) =>
                      handleSelectChange(
                        "cards",
                        "defaultTemplate",
                        e.target.value
                      )
                    }
                  >
                    {cardTemplates.map((template) => (
                      <option key={template.value} value={template.value}>
                        {template.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Auto-Share with Connections
                      </h3>
                      <p className="text-sm text-base-content/70">
                        Automatically share your card with new connections
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={settings?.cards.autoShareWithConnections}
                      onChange={(e) =>
                        handleToggleChange(
                          "cards",
                          "autoShareWithConnections",
                          e.target.checked
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Require Approval Before Sharing
                      </h3>
                      <p className="text-sm text-base-content/70">
                        Approve requests before others can share your card
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={settings?.cards.requireApprovalBeforeSharing}
                      onChange={(e) =>
                        handleToggleChange(
                          "cards",
                          "requireApprovalBeforeSharing",
                          e.target.checked
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Show Card Analytics</h3>
                      <p className="text-sm text-base-content/70">
                        See how many times your card has been viewed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={settings?.cards.showCardAnalytics}
                      onChange={(e) =>
                        handleToggleChange(
                          "cards",
                          "showCardAnalytics",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-primary" onClick={saveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Account</h3>
            <p className="py-4">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently deleted.
            </p>

            <div className="fieldset">
              <label className="fieldset-legend">
                <span className="label-text">Reason for deletion:</span>
              </label>
              <input
                type="text"
                className="input w-full py-3"
                placeholder="Reason"
                name="reason"
                onChange={handleDeleteModalInputChange}
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend">
                <span className="label-text">Enter password to confirm:</span>
              </label>
              <input
                type="password"
                className="input w-full py-3"
                placeholder="Password"
                name="password"
                onChange={handleDeleteModalInputChange}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                disabled={deletionPassword.length <= 6}
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
