import React from "react";

interface StreakProps {
  streaks: number; // Number of consecutive days
}

export const StreakTracker: React.FC<StreakProps> = ({ streaks }) => {
  return (
    <div className="streak-tracker bg-blue-600 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold">Your Streak</h3>
      <p className="text-2xl font-semibold">{streaks} {streaks === 1 ? "Day" : "Days"}</p>
      <p className="text-sm mt-2">Keep up the good work! Watch daily to maintain your streak.</p>
    </div>
  );
};
