import { Router } from "express";
import { addComment, deleteComment } from "../controllers/comment";
import isAuthenticated from "../middlewares/auth";
const router = Router();

router.post("/:id", isAuthenticated, addComment);
router.delete("/:id", deleteComment);
export default router;
