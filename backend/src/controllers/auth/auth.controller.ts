import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usersTable } from "../../config/schema";
import { db } from "../../config/db";
import { loginSchema, registerSchema } from "../../validations/auth.validation";

export class authController {
  register = async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { username, email, password } = validatedData;

      // untuk cek email apakah ada yang sama
      const existingEmail = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [insertedUser] = await db
        .insert(usersTable)
        .values({
          username: username,
          email: email,
          password: hashedPassword,
        })
        .$returningId();

      const newUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, insertedUser.id),
      });

      return res.status(201).json({
        success: true,
        message: "register succesfull",
        data: {
          user: {
            id: newUser?.id,
            username: newUser?.username,
            email: newUser?.email,
            role: newUser?.role,
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
      });
        console.log("EMAIL:", email);
        console.log("USER DITEMUKAN:", !!user);


      if (!user) {
        return res.status(404).json({
          success: false,
          message: "email or password incorrect",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("PASSWORD VALID:", isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: " email or password incorrect",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "5d",
        },
      );

      return res.status(200).json({
        success: true,
        message: "login succesfull",
        data: {
          token : token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
        error: error.message,
      });
    }
  };
}

export default new authController();
