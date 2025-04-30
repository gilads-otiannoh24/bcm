import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Users, Heart } from "lucide-react";
import HeroSection from "../components/Hero/hero";

const Landing: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <CreditCard className="w-12 h-12" />
            <h2 className="card-title">Manage Cards</h2>
            <p>Create and organize your digital business cards with ease.</p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <Users className="w-12 h-12" />
            <h2 className="card-title">Network</h2>
            <p>Connect with professionals and expand your business network.</p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body items-center text-center">
            <Heart className="w-12 h-12" />
            <h2 className="card-title">Favorites</h2>
            <p>Save and organize your important business connections.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="card bg-primary text-primary-content">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-3xl">
            Ready to Get Started?
          </h2>
          <p>
            Join thousands of professionals managing their business connections
            digitally.
          </p>
          <div className="card-actions justify-center">
            <Link to="/register" className="btn btn-secondary">
              Sign Up Now
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
