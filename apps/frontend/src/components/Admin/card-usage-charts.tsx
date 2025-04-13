"use client";

import { useEffect, useState } from "react";

export function CardUsageChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // This is where you'd initialize a chart library like Chart.js or Recharts
    // For simplicity, we're showing a placeholder chart
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-[240px] flex">
          {/* This is a simple placeholder for a chart */}
          {Array.from({ length: 12 }).map((_, index) => {
            const height = Math.floor(Math.random() * 80) + 20;
            return (
              <div
                key={index}
                className="flex flex-col justify-end flex-1 mx-1"
              >
                <div
                  className="bg-primary rounded-t-md"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-center mt-2 text-xs">
                  {
                    [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ][index]
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-primary rounded-full mr-2"></div>
          <span className="text-sm">Card Created</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-secondary rounded-full mr-2"></div>
          <span className="text-sm">Card Shared</span>
        </div>
      </div>
    </div>
  );
}
