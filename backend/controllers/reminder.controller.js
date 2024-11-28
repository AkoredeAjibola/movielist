import { Reminder } from '../models/reminder.js';  // Import the Reminder model

// Set a new reminder for a movie
export async function setReminder(req, res) {
  const { movieId, movieTitle, reminderDate } = req.body;  // Expecting movieId, movieTitle, and reminderDate in request body

  try {
    if (!movieId || !movieTitle || !reminderDate) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newReminder = new Reminder({
      user: req.user.id,  // Assuming you're using JWT and have a `user` object attached to the request
      movieId,
      movieTitle,
      reminderDate,
      createdAt: new Date(),
    });

    await newReminder.save();  // Save the reminder to the database

    res.status(201).json({ success: true, message: 'Reminder set successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Fetch all reminders for a user
export async function getReminders(req, res) {
  try {
    const reminders = await Reminder.find({ user: req.user.id });  // Get all reminders for the logged-in user

    if (reminders.length === 0) {
      return res.status(404).json({ success: false, message: 'No reminders found' });
    }

    res.status(200).json({ success: true, reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Delete a reminder
export async function deleteReminder(req, res) {
    const { reminderId } = req.params;  // Get the reminderId from the request params
  
    try {
      const reminder = await Reminder.findById(reminderId);
     
  
      if (!reminder) {
        return res.status(404).json({ success: false, message: 'Reminder not found' });
      }
  
      if (reminder.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this reminder' });
      }
  
      await Reminder.findByIdAndDelete(reminderId);
      res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
  