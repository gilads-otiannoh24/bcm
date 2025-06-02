import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import useOnRouteChange from "../hooks/useOnRouteChange";
import { useSidebarStore } from "../stores/sidebarStore";
import Footer from "./Footer";

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sideBarOpen = useSidebarStore((state) => state.open);
  const setSideBarOpen = useSidebarStore((state) => state.setOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useOnRouteChange(() => {
    setSideBarOpen(false);
  });

  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer">
        <input
          checked={sideBarOpen}
          id="drawer-toggle"
          type="checkbox"
          className="drawer-toggle"
          onChange={() => setSideBarOpen(!sideBarOpen)}
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <nav className="navbar bg-base-200 sticky top-0 z-50">
            <div className="flex-none">
              <Menu
                onClick={() => setSideBarOpen(!sideBarOpen)}
                className="h-5 w-5"
              />
            </div>
            <div className="flex-1">
              <Link to="/" className="btn btn-ghost text-xl">
                Business Card Manager
              </Link>
            </div>
            <div className="flex-none gap-2 space-x-2.5">
              <ThemeToggle />
              {user && (
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
                    className="mt-5 z-[1] p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52"
                  >
                    <li className="menu-title px-2 pt-0">
                      <span>{user?.fullName}</span>
                      <span className="text-xs font-normal text-base-content/60">
                        {user?.email}
                      </span>
                    </li>
                    <li>
                      <Link to="/profile">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-grow container mx-auto bg-base-200 px-4 py-8">
            <Outlet />
          </main>

          <Footer />
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};
