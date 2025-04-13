import { Link } from "react-router-dom";
import { CreditCard, Users, Share2, Shield, Zap, Globe } from "lucide-react";

// Update the styling to improve visual hierarchy and readability
export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-primary">
          About Business Card Manager
        </h1>

        <div className="space-y-12">
          <p className="text-xl text-base-content/80 mb-8 leading-relaxed">
            BCM is a modern business card management platform designed to help
            professionals create, share, and manage their digital business cards
            with ease.
          </p>

          <div className="bg-base-100 p-8 rounded-xl shadow-lg mb-12 border-l-4 border-primary">
            <h2 className="text-3xl font-bold mb-6 text-primary/90">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed">
              Our mission is to revolutionize the way professionals connect by
              eliminating paper waste and providing a seamless digital
              alternative to traditional business cards. We believe in creating
              meaningful connections while reducing environmental impact.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-primary/90 border-b-2 border-primary/20 pb-2">
              Key Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary/80">
                      Digital Business Cards
                    </h3>
                  </div>
                  <p className="text-base-content/80 text-lg">
                    Create beautiful, customizable digital business cards that
                    reflect your professional identity.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Share2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary/80">
                      Easy Sharing
                    </h3>
                  </div>
                  <p className="text-base-content/80 text-lg">
                    Share your cards instantly via email, messaging apps, or QR
                    codes.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary/80">
                      Contact Management
                    </h3>
                  </div>
                  <p className="text-base-content/80 text-lg">
                    Organize and manage your professional connections in one
                    secure place.
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary/80">
                      Privacy Controls
                    </h3>
                  </div>
                  <p className="text-base-content/80 text-lg">
                    Control who can see your information with advanced privacy
                    settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-primary/90 border-b-2 border-primary/20 pb-2">
              Why Choose BCM?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="flex items-start bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary/80">
                    Efficiency
                  </h3>
                  <p className="text-base-content/80">
                    No more carrying stacks of paper cards or running out at
                    important events.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary/80">
                    Eco-Friendly
                  </h3>
                  <p className="text-base-content/80">
                    Reduce paper waste and contribute to a more sustainable
                    business practice.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary/80">
                    Security
                  </h3>
                  <p className="text-base-content/80">
                    Your data is encrypted and protected with enterprise-grade
                    security.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-primary/80">
                    Professional Image
                  </h3>
                  <p className="text-base-content/80">
                    Stand out with modern, professional digital cards that leave
                    a lasting impression.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-100 p-8 rounded-xl shadow-lg mb-12 border-l-4 border-primary">
            <h2 className="text-3xl font-bold mb-6 text-primary/90">
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              BCM was founded in 2023 by a team of professionals who were
              frustrated with the limitations of traditional business cards.
              After exchanging countless paper cards at networking events only
              to lose them or struggle to organize the information, we decided
              there had to be a better way.
            </p>
            <p className="text-lg leading-relaxed">
              Our platform was built with a focus on user experience, design
              flexibility, and seamless integration with modern workflows.
              Today, we're proud to serve thousands of professionals across
              various industries, helping them make meaningful connections in a
              digital world.
            </p>
          </div>

          <div className="text-center bg-primary/5 p-10 rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-primary">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already made the switch
              to digital business cards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                Sign Up Now
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
