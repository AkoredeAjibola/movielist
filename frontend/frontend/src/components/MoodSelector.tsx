import { Button } from "@/components/ui/button";

type Mood = "Happy" | "Sad" | "Exciting" | "Romantic" | "Thrilling" | "Relaxing"

interface MoodSelectorProps {
  selectedMood: string;
  onSelectMood: (mood: string) => Promise<void>;
}

const moods: { type: Mood; emoji: string; label: string }[] = [
  { type: "Happy", emoji: "😊", label: "Happy" },
  { type: "Sad", emoji: "🌟", label: "Sad" },
  { type: "Romantic", emoji: "💖", label: "Romantic" },
  { type: "Exciting", emoji: "🤔", label: "Exciting" },
  { type: "Thrilling", emoji: "🎉", label: "Thrilling" },
  { type: "Relaxing", emoji: "🎉", label: "Relaxing" },
];
export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood, selectedMood }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {moods.map(({ type, emoji, label }) => (
        <Button
          key={type}
          variant={selectedMood === type ? "default" : "outline"}
          className="h-auto px-6 py-8 text-center"
          onClick={() => onSelectMood(type)}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};