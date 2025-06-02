"use client";

import { useState } from "react";
import { BarChart3, Users, CreditCard, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  const navItems = [
    {
      name: "My Cards",
      href: "/cards",
      icon: CreditCard,
    },
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Business Cards",
      href: "/admin/cards",
      icon: CreditCard,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden z[100] fixed inset-0 z-50 bg-base-100">
          <div className="flex justify-end p-4">
            <button
              className="btn btn-ghost btn-square"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-8">
              <div className="bg-primary text-primary-content p-2 rounded-lg mr-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <Link to={"/"} className="text-xl cursor-pointer font-bold">
                BCM Admin
              </Link>
            </div>
            <ul className="menu w-full">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={isActive(item.href) ? "active" : ""}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/logout" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogOut className="h-5 w-5" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-base-100 shadow-lg h-screen sticky top-0">
        <div className="flex items-center p-4 mb-4">
          <div className="bg-primary text-primary-content p-2 rounded-lg mr-2">
            <CreditCard className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">BCM Admin</span>
        </div>
        <ul className="menu menu-lg px-4 py-0 flex-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={isActive(item.href) ? "active" : ""}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-base-300">
          <a
            onClick={handleLogout}
            className="flex items-center cursor-pointer text-base-content hover:text-primary"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </a>
        </div>
      </div>
    </>
  );
}
