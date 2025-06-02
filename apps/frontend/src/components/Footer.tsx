import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-base-200/20 text-base-content">
      <div className="footer sm:footer-horizontal p-10 max-w-7xl mx-auto">
        <aside>
          <div className="flex items-center gap-2 mb-4">
            <div className="size-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-content font-bold text-lg">
                BCM
              </span>
            </div>
            <span className="text-xl font-bold">Business Card Manager</span>
          </div>
          <p className="max-w-xs">
            Streamline your networking with our powerful business card
            management platform. Organize, share, and grow your professional
            connections effortlessly.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title">Product</h6>
          <Link to={"/browse"} className="link link-hover">
            Browse
          </Link>
        </nav>

        <nav>
          <h6 className="footer-title">Company</h6>
          <Link to={"/about"} className="link link-hover">
            About Us
          </Link>
        </nav>

        <nav>
          <h6 className="footer-title">Support</h6>
          <Link to={"/contact"} className="link link-hover">
            Contact Support
          </Link>
        </nav>

        <nav>
          <h6 className="footer-title">Contact</h6>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:hello@bcm.com" className="text-sm">
              hello@bcm.com
            </a>
          </div>
        </nav>
      </div>

      <div className="footer footer-center p-4 bg-base-300 text-base-content border-t border-base-300">
        <aside className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm">© 2025 BCM. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/privacy" className="link link-hover">
              Privacy Policy
            </Link>
            <Link to="/terms" className="link link-hover">
              Terms of Service
            </Link>
          </div>
        </aside>
      </div>
    </footer>
  );
}
