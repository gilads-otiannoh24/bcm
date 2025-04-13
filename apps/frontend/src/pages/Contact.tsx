import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "../components/contact-form";

export const metadata = {
  title: "Contact Us | Business Card Manager",
  description:
    "Get in touch with the Business Card Manager team for support, feedback, or inquiries",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg mb-8">
          Have questions, feedback, or need assistance? We're here to help! Fill
          out the form below or use our contact information to get in touch with
          our team.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body items-center text-center">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-bold">Email</h3>
              <p className="mb-2">For general inquiries:</p>
              <a
                href="mailto:info@businesscardmanager.com"
                className="text-primary hover:underline"
              >
                info@businesscardmanager.com
              </a>
              <p className="mt-2 mb-2">For support:</p>
              <a
                href="mailto:support@businesscardmanager.com"
                className="text-primary hover:underline"
              >
                support@businesscardmanager.com
              </a>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body items-center text-center">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-bold">Phone</h3>
              <p className="mb-2">Customer Support:</p>
              <a
                href="tel:+18001234567"
                className="text-primary hover:underline"
              >
                +1 (800) 123-4567
              </a>
              <p className="mt-2 mb-2">Business Hours:</p>
              <p>Monday-Friday: 9am-5pm EST</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body items-center text-center">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-bold">Office</h3>
              <p className="mb-2">Headquarters:</p>
              <address className="not-italic">
                123 Business Ave
                <br />
                Suite 456
                <br />
                San Francisco, CA 94103
                <br />
                United States
              </address>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="collapse collapse-plus bg-base-100 shadow-sm">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                How do I create a digital business card?
              </div>
              <div className="collapse-content">
                <p>
                  After signing up for Business Card Manager, navigate to the
                  "My Cards" section and click on "Create New Card." Follow the
                  step-by-step process to customize your card with your
                  information, choose a template, and set your preferences.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow-sm">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I have multiple business cards?
              </div>
              <div className="collapse-content">
                <p>
                  Yes! With Business Card Manager, you can create multiple
                  business cards for different purposes, roles, or
                  organizations. Simply go to the "My Cards" section and create
                  as many cards as you need.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow-sm">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                How do I share my digital business card?
              </div>
              <div className="collapse-content">
                <p>
                  You can share your digital business card in several ways:
                  generate a QR code that others can scan, send a direct link
                  via email or messaging apps, or use our in-app sharing feature
                  to connect with other Business Card Manager users.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow-sm">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Is there a mobile app available?
              </div>
              <div className="collapse-content">
                <p>
                  Yes, Business Card Manager is available as a mobile app for
                  both iOS and Android devices. You can download it from the App
                  Store or Google Play Store to manage your business cards on
                  the go.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow-sm">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                What subscription plans do you offer?
              </div>
              <div className="collapse-content">
                <p>
                  Business Card Manager offers a free basic plan with limited
                  features, as well as Premium and Business plans with
                  additional capabilities. Visit our Pricing page for detailed
                  information about each plan's features and pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
