import { AdminSidebar } from "./sidebar";
import { AdminHeader } from "./header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
