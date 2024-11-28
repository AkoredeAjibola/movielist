import { Router } from "express";
import { addReminder, getReminders } from "../controllers/reminder.controller";

const router = Router();

router.post("/", addReminder);
router.get("/user/:userId", getReminders);

export default router;
