"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { User } from "@shared/types";

// Define the user type (same as in users page)

type UserEditModalProps = {
  user: User;
  onClose: () => void;
  onSave: (user: User, sendPasswordResetmail: boolean) => void;
};

export function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [formData, setFormData] = useState<User>({ ...user });
  const [sendPasswordResetmail, setSendPasswordResetmail] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, sendPasswordResetmail);
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
        <h3 className="font-bold text-lg mb-4">Edit User</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.fullName}
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
                <option value="admin">Admin</option>
                <option value="premium">Premium</option>
                <option value="user">User</option>
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

            {/* Password Reset */}
            <div className="form-control md:col-span-2">
              <label className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-2"
                  onChange={(e) => {
                    setSendPasswordResetmail(e.target.checked);
                  }}
                />
                <span className="label-text">Send password reset email</span>
              </label>
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
