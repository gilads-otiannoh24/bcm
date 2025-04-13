import { BarChart3, Users, CreditCard, Activity } from "lucide-react";
import { StatsCard } from "../../components/Admin";
import { CardUsageChart } from "../../components/Admin";
import { RecentActivitiesTable } from "../../components/Admin";
import { TopUsersTable } from "../../components/Admin";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

type Stats = {
  totalUsers: number;
  totalCards: number;
  usersPercentageChange: number;
  cardsPercentageChange: number;
};

export default function AdminDashboard() {
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await api.get("/misc/admindashboardstats");

        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
      } finally {
        setIsStatsLoading(false);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="Total Users"
          value={`${stats?.totalUsers}`}
          change={`${stats?.usersPercentageChange}%`}
          trend={
            stats?.usersPercentageChange
              ? stats?.usersPercentageChange > 0
                ? "up"
                : "down"
              : "up"
          }
          icon={<Users className="h-8 w-8 text-primary" />}
          isLoadinng={isStatsLoading}
        />
        <StatsCard
          title="Business Cards"
          value={`${stats?.totalCards}`}
          change={`${stats?.cardsPercentageChange}%`}
          trend={
            stats?.cardsPercentageChange
              ? stats?.cardsPercentageChange > 0
                ? "up"
                : "down"
              : "up"
          }
          icon={<CreditCard className="h-8 w-8 text-primary" />}
          isLoadinng={isStatsLoading}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Card Usage Statistics
            </h2>
            <div className="h-80">
              <CardUsageChart />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Users
            </h2>
            <TopUsersTable />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </h2>
          <RecentActivitiesTable />
        </div>
      </div>
    </div>
  );
}
