import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: ReactNode;
  isLoadinng: boolean;
};

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
  isLoadinng,
}: StatsCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-medium text-base-content/70">
              {title}
            </h2>
            <p className="text-2xl font-bold mt-1">
              {isLoadinng ? (
                <span className="loading loading-dots"></span>
              ) : (
                <>{value}</>
              )}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
        </div>
        <div className="flex items-center mt-2">
          {isLoadinng ? (
            <span className="loading loading-dots"></span>
          ) : (
            <>
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-success mr-1" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-error mr-1" />
              ) : null}
              <span
                className={
                  trend === "up"
                    ? "text-success"
                    : trend === "down"
                    ? "text-error"
                    : ""
                }
              >
                {change} since last month
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
