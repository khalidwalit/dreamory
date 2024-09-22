import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
  getEventById
} from "../controllers/eventController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = Router();

router.post("/", authMiddleware, upload.single("thumbnail"), createEvent); // Handle file upload
router.get("/", listEvents);
router.get("/:id", getEventById);
router.put("/:id", authMiddleware,upload.single("thumbnail"), updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
