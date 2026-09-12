import { Response } from "express";
import { ZodError } from "zod";
import { eq } from "drizzle-orm";
import { CreatePostSchema, UpdatePostSchema } from "../../validations/posts.validation";
import { db } from "../../config/db";
import { postsTable } from "../../config/schema";
import { uploudToCloudinary } from "../../services/cloudinary.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export class postsController {
  // GET /posts -> daftar artikel (publik, tidak butuh login)
  getAllPosts = async (_req: AuthRequest, res: Response) => {
    try {
      const data = await db.query.postsTable.findMany({
        with: { category: true },
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("get all posts error:", error);
      return res.status(500).json({
        success: false,
        message: "gagal mengambil daftar artikel",
      });
    }
  };

  // GET /posts/:id -> detail artikel (publik, tidak butuh login)
  getPostById = async (req: AuthRequest, res: Response) => {
    try {
      const post = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, Number(req.params.id)),
        with: { category: true },
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "artikel tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      console.error("get post by id error:", error);
      return res.status(500).json({
        success: false,
        message: "gagal mengambil detail artikel",
      });
    }
  };

  // POST /posts -> butuh login (verifyToken di route)
  createPost = async (req: AuthRequest, res: Response) => {
    try {
      const validatedData = CreatePostSchema.parse(req.body);
      const userId = req.user!.id;

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const uploadResult = await uploudToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const [insertedPost] = await db
        .insert(postsTable)
        .values({
          ...validatedData,
          userId,
          imageUrl,
          imagePublicId,
        })
        .$returningId();

      const newPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, insertedPost.id),
        with: { category: true },
      });

      return res.status(201).json({
        success: true,
        message: "artikel berhasil dibuat",
        data: newPost,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "data tidak valid",
          errors: error.issues,
        });
      }

      console.error("create post error:", error);
      return res.status(500).json({
        success: false,
        message: "terjadi kesalahan pada server",
      });
    }
  };

  // PUT /posts/:id -> butuh login + harus pemilik artikel
  updatePost = async (req: AuthRequest, res: Response) => {
    try {
      const postId = Number(req.params.id);

      const existingPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
      });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "artikel tidak ditemukan",
        });
      }

      if (existingPost.userId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          message: "kamu tidak punya akses untuk mengubah artikel ini",
        });
      }

      const validatedData = UpdatePostSchema.parse(req.body);

      let imageUrl = existingPost.imageUrl;
      let imagePublicId = existingPost.imagePublicId;

      if (req.file) {
        const uploadResult = await uploudToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      await db
        .update(postsTable)
        .set({ ...validatedData, imageUrl, imagePublicId })
        .where(eq(postsTable.id, postId));

      const updatedPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
        with: { category: true },
      });

      return res.status(200).json({
        success: true,
        message: "artikel berhasil diperbarui",
        data: updatedPost,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "data tidak valid",
          errors: error.issues,
        });
      }

      console.error("update post error:", error);
      return res.status(500).json({
        success: false,
        message: "terjadi kesalahan pada server",
      });
    }
  };

  // DELETE /posts/:id -> butuh login + harus pemilik artikel
  deletePost = async (req: AuthRequest, res: Response) => {
    try {
      const postId = Number(req.params.id);

      const existingPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
      });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "artikel tidak ditemukan",
        });
      }

      if (existingPost.userId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          message: "kamu tidak punya akses untuk menghapus artikel ini",
        });
      }

      await db.delete(postsTable).where(eq(postsTable.id, postId));

      return res.status(200).json({
        success: true,
        message: "artikel berhasil dihapus",
      });
    } catch (error) {
      console.error("delete post error:", error);
      return res.status(500).json({
        success: false,
        message: "terjadi kesalahan pada server",
      });
    }
  };
}

export default new postsController();