// import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";

// interface WatchReminderProps {
//   movieId: string;
//   movieTitle: string;
//   onClose: () => void;
// }

// export const WatchReminder = ({
//   movieId,
//   movieTitle,
//   onClose,
// }: WatchReminderProps) => {
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const { toast } = useToast();

//   const handleSetReminder = async () => {
//     if (!date) return;



//     try {
//       const token = localStorage.getItem("token");
//       const reminderDate = date.toISOString();
//       await fetch('https://movielist-nl59.onrender.com/api/v1/reminder/set', {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
//           "Cache-Control": "no-cache, no-store, must-revalidate",

//         },
//         credentials: "include",
//         body: JSON.stringify({
//           movieId,            // movieId to identify which movie
//           movieTitle,         // Send movieTitle for better clarity on reminder
//           reminderDate,       // The date formatted as ISO string
//         }),

//       });

//       toast({
//         title: "Reminder set!",
//         description: `We'll remind you to watch ${movieTitle} on ${new Date(reminderDate).toLocaleDateString()}`,
//       });
//       onClose();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to set reminder",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Set Watch Reminder</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 py-4">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             className="rounded-md border"
//           />
//           <div className="flex justify-end space-x-2">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSetReminder}>Set Reminder</Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };



import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DatePicker from "react-datepicker"; // Install via `npm install react-datepicker`
import "react-datepicker/dist/react-datepicker.css"; // Import styles

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
  const [dateTime, setDateTime] = useState<Date | undefined>(new Date());
  const [existingReminder, setExistingReminder] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReminders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://movielist-nl59.onrender.com/api/v1/reminder/",
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          const reminderExists = data.reminders.some(
            (reminder) => reminder.movieId === movieId
          );
          setExistingReminder(reminderExists);
        }
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, [movieId]);


  const handleSetReminder = async () => {
    if (!dateTime) return;

    try {
      const token = localStorage.getItem("token");
      const reminderDate = dateTime.toISOString(); // Combine date and time
      await fetch("https://movielist-nl59.onrender.com/api/v1/reminder/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "include",
        body: JSON.stringify({
          movieId,
          movieTitle,
          reminderDate,
        }),
      });

      toast({
        title: "Reminder set!",
        description: `We'll remind you to watch ${movieTitle} on ${new Date(
          reminderDate
        ).toLocaleString()}`,
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
          <DatePicker
            selected={dateTime}
            onChange={(date: Date) => setDateTime(date)} // Single date selection
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={1} // Time selection intervals (15 minutes)
            dateFormat="MMMM d, yyyy h:mm aa" // Custom format
            className="rounded-md border w-full p-2"
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
