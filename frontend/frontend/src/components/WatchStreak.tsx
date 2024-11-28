import { Flame } from "lucide-react";
import { Progress } from "./ui/progress";

interface WatchStreakProps {
  currentStreak: number;
  bestStreak: number;
}

export const WatchStreak = ({ currentStreak, bestStreak }: WatchStreakProps) => {
  return (
    <div className="bg-card p-4 rounded-lg space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold">Watch Streak</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Current Streak</span>
          <span className="font-semibold">{currentStreak} days</span>
        </div>
        <Progress value={(currentStreak / bestStreak) * 100} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Best</span>
          <span>{bestStreak} days</span>
        </div>
      </div>
    </div>
  );
};