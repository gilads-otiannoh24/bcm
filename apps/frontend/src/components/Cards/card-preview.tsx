import { CreditCard, Mail, Phone, Globe, MapPin, Building } from "lucide-react";

type CardPreviewProps = {
  card: {
    name: string;
    jobTitle: string;
    company: string;
    email: string;
    phone: string;
    website?: string;
    address?: string;
    template: string;
    color: string;
  };
};

export function CardPreview({ card }: CardPreviewProps) {
  // Get color class based on selected color
  const getColorClass = () => {
    switch (card.color) {
      case "blue":
        return "bg-blue-500 text-white";
      case "green":
        return "bg-green-500 text-white";
      case "red":
        return "bg-red-500 text-white";
      case "purple":
        return "bg-purple-500 text-white";
      case "orange":
        return "bg-orange-500 text-white";
      case "teal":
        return "bg-teal-500 text-white";
      case "pink":
        return "bg-pink-500 text-white";
      case "black":
        return "bg-black text-white";
      case "gray":
        return "bg-gray-500 text-white";
      case "gold":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  // Render different templates
  const renderTemplate = () => {
    switch (card.template) {
      case "professional":
        return renderProfessionalTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "minimal":
        return renderMinimalTemplate();
      case "bold":
        return renderBoldTemplate();
      case "elegant":
        return renderElegantTemplate();
      default:
        return renderProfessionalTemplate();
    }
  };

  // Professional template
  const renderProfessionalTemplate = () => (
    <div
      data-theme="light"
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
    >
      <div className={`p-4 ${getColorClass()}`}>
        <h2 className="text-xl font-bold">{card.name}</h2>
        <p>{card.jobTitle}</p>
      </div>
      <div className="p-4 flex-1">
        <div className="flex items-center mb-2">
          <Building className="h-4 w-4 mr-2 text-gray-500" />
          <span>{card.company}</span>
        </div>
        <div className="flex items-center mb-2">
          <Mail className="h-4 w-4 mr-2 text-gray-500" />
          <span>{card.email}</span>
        </div>
        <div className="flex items-center mb-2">
          <Phone className="h-4 w-4 mr-2 text-gray-500" />
          <span>{card.phone}</span>
        </div>
        {card.website && (
          <div className="flex items-center mb-2">
            <Globe className="h-4 w-4 mr-2 text-gray-500" />
            <span>{card.website}</span>
          </div>
        )}
        {card.address && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{card.address}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Creative template
  const renderCreativeTemplate = () => (
    <div
      data-theme="light"
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-full flex">
        <div
          className={`w-1/3 ${getColorClass()} p-4 flex flex-col justify-between`}
        >
          <div>
            <CreditCard className="h-8 w-8 mb-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{card.name}</h2>
            <p className="text-sm">{card.jobTitle}</p>
          </div>
        </div>
        <div className="w-2/3 p-4">
          <div className="mb-4">
            <h3 className="font-bold">{card.company}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <span>{card.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              <span>{card.phone}</span>
            </div>
            {card.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500" />
                <span>{card.website}</span>
              </div>
            )}
            {card.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{card.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Minimal template
  const renderMinimalTemplate = () => (
    <div
      data-theme="light"
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col p-6"
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">{card.name}</h2>
        <p
          className={`text-sm ${
            getColorClass().includes("bg-black")
              ? "text-black"
              : getColorClass()
                  .replace("bg-", "text-")
                  .replace("text-white", "")
          }`}
        >
          {card.jobTitle}
        </p>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="border-t border-b py-4 space-y-2">
          <div>{card.company}</div>
          <div>{card.email}</div>
          <div>{card.phone}</div>
          {card.website && <div>{card.website}</div>}
          {card.address && <div>{card.address}</div>}
        </div>
      </div>
    </div>
  );

  // Bold template
  const renderBoldTemplate = () => (
    <div
      data-theme="light"
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className={`h-1/4 ${getColorClass()}`}></div>
      <div className="h-3/4 p-4 relative">
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full ${getColorClass()} w-16 h-16 flex items-center justify-center`}
        >
          <span className="text-2xl font-bold">{card.name.charAt(0)}</span>
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold">{card.name}</h2>
          <p className="text-sm mb-4">{card.jobTitle}</p>
          <p className="font-bold">{card.company}</p>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex flex-col items-center">
            <Mail className="h-5 w-5 mb-1 text-gray-500" />
            <span className="text-xs">{card.email}</span>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="h-5 w-5 mb-1 text-gray-500" />
            <span className="text-xs">{card.phone}</span>
          </div>
          {card.website && (
            <div className="flex flex-col items-center">
              <Globe className="h-5 w-5 mb-1 text-gray-500" />
              <span className="text-xs">{card.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Elegant template
  const renderElegantTemplate = () => (
    <div
      data-theme="light"
      className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      <div className="h-full p-6 flex flex-col">
        <div className="mb-4 flex items-center">
          <div className={`w-2 h-12 ${getColorClass()} mr-4`}></div>
          <div>
            <h2 className="text-xl font-bold">{card.name}</h2>
            <p className="text-sm">{card.jobTitle}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-4">
            <p className="font-medium">{card.company}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span>{card.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{card.phone}</span>
            </div>
            {card.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                <span>{card.website}</span>
              </div>
            )}
            {card.address && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{card.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`h-1 ${getColorClass()} mt-4`}></div>
      </div>
    </div>
  );

  return <div className="w-full h-full">{renderTemplate()}</div>;
}
