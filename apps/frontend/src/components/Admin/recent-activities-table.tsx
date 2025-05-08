import { CheckCircle, User, CreditCard, Share2, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import Loading from "../Loading";
import { User as UserType } from "@shared/types";

// Define the types for activities
type ActivityType =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "card_created"
  | "card_shared"
  | "card_collected"
  | "card_duplicated"
  | "card_viewed"
  | "card_updated"
  | "user_deleted"
  | "card_deleted"
  | "connection_created"
  | "connection_updated"
  | "connection_deleted"
  | "card_updated"
  | "user_logged_in"
  | "user_logged_out"
  | "user_reset_password"
  | "user_forgot_password"
  | "user_updated";

type Activity = {
  _id: string;
  type: ActivityType;
  user: UserType;
  details: string;
  relatedUser: UserType;
  timestamp: string;
  ip: string;
  userAgent: string;
};

// Helper function to get the appropriate icon for each activity type
function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "user_created":
      return <User className="h-5 w-5 text-success" />;
    case "card_created":
      return <CreditCard className="h-5 w-5 text-primary" />;
    case "card_shared":
      return <Share2 className="h-5 w-5 text-info" />;
    case "user_deleted":
      return <X className="h-5 w-5 text-error" />;
    case "card_deleted":
      return <X className="h-5 w-5 text-error" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
}

export function RecentActivitiesTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAcitivities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/activities");

        if (response.data.success) {
          setActivities(response.data.data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    getAcitivities();
  }, []);

  const getActivityDescription = (type: ActivityType): string => {
    const mapping: Record<ActivityType, string> = {
      user_created: "User creation",
      user_updated: "User update",
      user_deleted: "User deletion",
      card_created: "Card creation",
      card_shared: "Card sharing",
      card_collected: "Card collection",
      card_duplicated: "Card duplication",
      card_viewed: "Card view",
      card_updated: "Card update",
      card_deleted: "Card deletion",
      connection_created: "Connection creation",
      connection_updated: "Connection update",
      connection_deleted: "Connection deletion",
      user_logged_in: "User login",
      user_logged_out: "User logout",
      user_reset_password: "Password reset",
      user_forgot_password: "Password reset request",
    };

    return mapping[type] + "...";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[50dvh]">
      <table className="table">
        <thead>
          <tr>
            <th>Activity</th>
            <th>User</th>
            <th>Details</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>
                <div className="flex items-center">
                  <div className="avatar placeholder mr-3">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div>{getActivityDescription(activity.type)}</div>
                </div>
              </td>
              <td>{activity.user.firstName}</td>
              <td>{activity.details}</td>
              <td>{activity.timestamp}</td>
              <td>
                <div className="badge badge-sm badge-success gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Completed
                </div>
              </td>
            </tr>
          ))}

          {activities.length === 0 && (
            <tr>
              <td className="text-center font-bold text-base" colSpan={5}>
                No activities yet!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
