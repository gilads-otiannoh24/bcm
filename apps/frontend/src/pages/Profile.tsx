import React, { useEffect } from "react";
import UserProfile from "../components/Profile";
import api from "../lib/axios";
import useToastStore from "../hooks/useToast";
import Loading from "../components/Loading";

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = React.useState<UserProfile | {}>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToastStore();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await api.get("/auth/profile");

        if (response.data.success) {
          setUserProfile(response.data.data);
        }
      } catch (error) {
        toast.error("Error fetching user profile");
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <UserProfile
        profile={userProfile as UserProfile}
        onProfileUpdate={(profile: UserProfile) => setUserProfile(profile)}
      />
    </div>
  );
};

export default Profile;
