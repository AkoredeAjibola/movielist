import express from 'express';
import { setReminder, getReminders, deleteReminder } from '../controllers/reminder.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';  

const router = express.Router();

// Route to set a reminder
router.post('/set', protectRoute, setReminder);

// Route to get all reminders for the logged-in user
router.get('/', protectRoute, getReminders);

// Route to delete a reminder
router.delete('/:reminderId', protectRoute, deleteReminder);

export default router;
