import { Router } from "express";
import {
  editPost,
  createPost,
  getPost,
  getPosts,
  liked,
  deletePost,
} from "../controllers/post";
import upload from "../utils/uploader";
import isAuthenticated from "../middlewares/auth";
const router = Router();
router.post("/", isAuthenticated, upload.single("image"), createPost);
router.get("/", getPosts);
router.get("/getPost/:id", getPost);
router.patch("/:id", isAuthenticated, editPost);
router.get("/like/:id", isAuthenticated, liked);
router.delete("/:id", deletePost);
export default router;
