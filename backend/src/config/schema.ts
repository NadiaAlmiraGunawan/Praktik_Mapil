import { mysqlTable, mysqlEnum, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";

export const USER_ROLES = ["user", "Author"] as const;

export const POST_STATUS = ["delete", "published"] as const;

// USERS
export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", USER_ROLES).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// CATEGORIES
export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// POSTS
// PENTING: categoryId ditambahkan sebagai FK ke categories.
// Sebelumnya kolom ini tidak ada padahal sudah dipakai di route/relasi lain.
export const postsTable = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  categoryId: int("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"), // Kolom untuk simpan URL gambar
  imagePublicId: varchar("image_public_id", { length: 255 }), // Kolom untuk simpan Public ID Cloudinary
  status: mysqlEnum("status", POST_STATUS).notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Relasi posts -> categories & posts -> users
// Sebelumnya menunjuk ke variabel "posts" yang tidak pernah dideklarasikan,
// sehingga file ini gagal di-compile. Sudah diperbaiki jadi postsTable.
export const postsRelations = relations(postsTable, ({ one }) => ({
  category: one(categories, {
    fields: [postsTable.categoryId],
    references: [categories.id],
  }),
  author: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
}));

// COMMENTS
export const commentsTable = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});