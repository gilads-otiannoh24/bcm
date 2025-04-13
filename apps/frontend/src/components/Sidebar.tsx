import {
  CreditCard,
  Users,
  Settings,
  Info,
  FileText,
  Shield,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebarStore } from "../stores/sidebarStore";

const Sidebar = () => {
  const { user } = useAuth();

  const setSidebarOpen = useSidebarStore((state) => state.setOpen);

  return (
    <div className="drawer-side z-10">
      <div
        onClick={() => setSidebarOpen(false)}
        aria-label="close sidebar"
        className="drawer-overlay"
      ></div>
      <ul className="menu menu-lg mt-16 p-4 w-80 min-h-full bg-base-200 text-base-content">
        {user && (
          <li>
            <Link to="/cards">
              <CreditCard className="h-4 w-4" /> My Cards
            </Link>
          </li>
        )}
        {user?.role === "admin" && (
          <li>
            <Link to="/admin">
              <Users className="h-4 w-4" /> CMS Panel
            </Link>
          </li>
        )}

        {user && (
          <li>
            <Link to="/settings">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </li>
        )}
        <li>
          <Link to="/about">
            <Info className="h-4 w-4" /> About Us
          </Link>
        </li>
        <li>
          <Link to="/terms">
            <FileText className="h-4 w-4" /> Terms of Service
          </Link>
        </li>
        <li>
          <Link to="/privacy">
            <Shield className="h-4 w-4" /> Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <Mail className="h-4 w-4" /> Contact Us
          </Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to={"/login"} className="btn btn-primary w-full mb-3">
                Login
              </Link>
            </li>
            <li>
              <Link to={"/register"} className="btn btn-secondary w-full">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
export default Sidebar;
