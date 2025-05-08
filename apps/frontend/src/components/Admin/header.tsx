"use client";

import { useState } from "react";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function AdminHeader() {
  const [notifications] = useState(3);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-base-100 shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="relative md:w-96 hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-base-content/50" />
          </div>
          <h1 className="text-lg font-medium">Admin Panel</h1>
        </div>

        <div className="flex-1 md:flex-none">
          <h1 className="text-xl font-bold md:hidden">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle indicator"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="indicator-item badge badge-primary badge-sm">
                  {notifications}
                </span>
              )}
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 mt-4"
            >
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <a
                  href="/admin/notifications"
                  className="text-xs text-primary hover:underline"
                >
                  View All
                </a>
              </div>
              <div className="py-2">
                <div className="p-3 hover:bg-base-200 rounded-lg">
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-base-content/70">
                    Sarah Wilson just created an account
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    2 hours ago
                  </p>
                </div>
                <div className="p-3 hover:bg-base-200 rounded-lg">
                  <p className="font-medium">System update completed</p>
                  <p className="text-sm text-base-content/70">
                    The system has been updated to version 2.0.4
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    5 hours ago
                  </p>
                </div>
                <div className="p-3 hover:bg-base-200 rounded-lg">
                  <p className="font-medium">Database backup</p>
                  <p className="text-sm text-base-content/70">
                    Weekly database backup completed successfully
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-primary text-neutral-content rounded-full w-10">
                <span className="text-xl h-full flex font-bold items-center justify-center">
                  {user?.fullName?.[0]?.toUpperCase() || "B"}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title px-2 pt-0">
                <span>{user?.fullName}</span>
                <span className="text-xs font-normal text-base-content/60">
                  {user?.email}
                </span>
              </li>
              <li>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
