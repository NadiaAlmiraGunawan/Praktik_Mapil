import { Request, Response } from "express";
import {CreatePostSchema} from "../../validations/posts.validation";
import {db} from "../../config/db";
import { postsTable } from "../../config/schema";
import {eq} from "drizzle-orm";
import { uploudToCloudinary } from "../../services/cloudinary.service";

export class postsController {
    createPost = async(req:Request, res:Response) => {
        try {
            const validateData = CreatePostSchema.parse(req.body);
            const {userId,title,content} = validateData;
             
            let imageUrl: string | undefined;
            let imagePublicId: string | undefined;

            if (req.file) {
                const uploadResult = await uploudToCloudinary(req.file.buffer);
                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;
            }

            const[insertedPost] = await db.insert(postsTable).values({userId,title,content,imageUrl,imagePublicId,}).
            $returningId();

            const newPost = await db.query.postsTable.findFirst({where: eq(postsTable.id, insertedPost.id)});

            return res.status(201).json({
                success: true,
                message: "post created succesfully",
                data: {
                    post: newPost,
                },
            });

        } catch(error) {
            console.error("create post error:", error);
            return res.status(500).json({
                success: false,
                message: "terjadi kesalahan pada server",
                error: error instanceof Error
                ? error.message
                : error,
            })

        }
    }
}
export default new postsController
