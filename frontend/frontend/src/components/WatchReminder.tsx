import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface WatchReminderProps {
  movieId: string;
  movieTitle: string;
  onClose: () => void;
}

export const WatchReminder = ({
  movieId,
  movieTitle,
  onClose,
}: WatchReminderProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSetReminder = async () => {
    if (!date) return;



    try {
      const reminderDate = date.toISOString();
      await fetch('http://localhost:3000/api/v1/reminder/set', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,            // movieId to identify which movie
          movieTitle,         // Send movieTitle for better clarity on reminder
          reminderDate,       // The date formatted as ISO string
        }),
        credentials: "include",
      });

      toast({
        title: "Reminder set!",
        description: `We'll remind you to watch ${movieTitle} on ${new Date(reminderDate).toLocaleDateString()}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set reminder",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Watch Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSetReminder}>Set Reminder</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};