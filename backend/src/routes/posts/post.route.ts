import { Router } from "express";
import PostController from "../../controllers/posts/post.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { uploadSinggleImage } from "../../middleware/upload.middleware";


const router = Router();

// Publik — guest bisa lihat & baca tanpa login
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);

// Butuh login — dipakai untuk arahkan guest ke halaman login di Flutter
router.post("/", verifyToken, uploadSinggleImage, PostController.createPost);
router.put("/:id", verifyToken, uploadSinggleImage, PostController.updatePost);
router.delete("/:id", verifyToken, PostController.deletePost);

export default router;