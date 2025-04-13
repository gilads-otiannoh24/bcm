"use client";

import { useState } from "react";
import {
  Briefcase,
  Building,
  Edit,
  Mail,
  MapPin,
  Phone,
  Share2,
  Linkedin,
  Twitter,
  Github,
  CreditCard,
  Clock,
} from "lucide-react";
import { ProfileEditModal } from "./profile-edit-modal";
import useToastStore from "../../hooks/useToast";

// Define the user profile type
export type UserProfile = {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  stats: {
    cardsCollected: number;
    cardsShared: number;
    connections: number;
  };
  recentActivity: {
    id: string;
    type: "collected" | "shared" | "updated";
    name: string;
    date: string;
  }[];
};

// Mock user data
const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  jobTitle: "Senior Product Manager",
  company: "TechNova Solutions",
  location: "San Francisco, CA",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Product leader with 8+ years of experience in SaaS and fintech. Passionate about creating user-centric solutions that drive business growth and improve customer experience.",
  avatar: "/placeholder.svg?height=200&width=200",
  socialLinks: {
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexjohnson",
    github: "https://github.com/alexjohnson",
  },
  stats: {
    cardsCollected: 145,
    cardsShared: 87,
    connections: 213,
  },
  recentActivity: [
    {
      id: "act-1",
      type: "collected",
      name: "Sarah Williams",
      date: "2 days ago",
    },
    {
      id: "act-2",
      type: "shared",
      name: "Michael Chen",
      date: "5 days ago",
    },
    {
      id: "act-3",
      type: "updated",
      name: "Your business card",
      date: "1 week ago",
    },
    {
      id: "act-4",
      type: "collected",
      name: "David Rodriguez",
      date: "2 weeks ago",
    },
  ],
};

export function UserProfile({
  profile = mockUserProfile,
  onProfileUpdate,
}: {
  profile?: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToastStore();

  // Function to handle sharing profile
  const handleShareProfile = () => {
    // In a real app, this would open a share dialog or copy a link
    alert("Share functionality would be implemented here");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl lg:col-span-1">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
              />
            </div>
          </div>
          <h2 className="card-title text-2xl mt-4">{profile.name}</h2>
          <div className="flex items-center text-base-content/70">
            <Briefcase className="h-4 w-4 mr-1" />
            <span>{profile.jobTitle}</span>
          </div>
          <div className="flex items-center text-base-content/70">
            <Building className="h-4 w-4 mr-1" />
            <span>{profile.company}</span>
          </div>
          <div className="flex items-center text-base-content/70">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.location}</span>
          </div>

          <div className="divider"></div>

          <div className="w-full">
            <div className="flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">{profile.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">{profile.phone}</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-2">
            {profile.socialLinks.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-circle btn-sm"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="card-actions justify-between w-full mt-6">
            <button
              className="btn btn-outline btn-primary flex-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            <button
              className="btn btn-primary flex-1"
              onClick={handleShareProfile}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bio Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">About</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <CreditCard className="h-8 w-8 text-primary" />
              <h2 className="card-title text-3xl">
                {profile.stats.cardsCollected}
              </h2>
              <p className="text-base-content/70">Cards Collected</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <Share2 className="h-8 w-8 text-primary" />
              <h2 className="card-title text-3xl">
                {profile.stats.cardsShared}
              </h2>
              <p className="text-base-content/70">Cards Shared</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Activity
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  {profile.recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">
                                {activity.type === "collected"
                                  ? "C"
                                  : activity.type === "shared"
                                  ? "S"
                                  : "U"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{activity.name}</div>
                            <div className="text-sm opacity-50">
                              {activity.type === "collected"
                                ? "Card collected"
                                : activity.type === "shared"
                                ? "Card shared with"
                                : "Card updated"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right text-sm text-base-content/70">
                        {activity.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <ProfileEditModal
          user={profile}
          onClose={() => {
            setIsEditing(false);
          }}
          onSave={(profile: UserProfile) => {
            toast.success(" Profile updated successfully");
            setIsEditing(false);
            onProfileUpdate(profile);
          }}
        />
      )}
    </div>
  );
}
