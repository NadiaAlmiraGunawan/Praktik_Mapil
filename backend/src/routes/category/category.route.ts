import { Router } from "express";
import { eq } from "drizzle-orm";
import { categories } from "../../config/schema";
import { db } from "../../config/db";
import { verifyToken } from "../../middleware/auth.middleware";


const router = Router();

// Publik
router.get("/", async (_req, res) => {
  const data = await db.select().from(categories);
  res.status(200).json({ success: true, data });
});

router.get("/:id", async (req, res) => {
  const data = await db
    .select()
    .from(categories)
    .where(eq(categories.id, Number(req.params.id)));

  if (!data.length) {
    return res.status(404).json({ success: false, message: "kategori tidak ditemukan" });
  }
  res.status(200).json({ success: true, data: data[0] });
});

// Butuh login
router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;
  const [result] = await db.insert(categories).values({ name }).$returningId();
  res.status(201).json({ success: true, data: { id: result.id, name } });
});

router.put("/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  await db
    .update(categories)
    .set({ name })
    .where(eq(categories.id, Number(req.params.id)));
  res.status(200).json({ success: true, message: "kategori berhasil diperbarui" });
});

router.delete("/:id", verifyToken, async (req, res) => {
  await db.delete(categories).where(eq(categories.id, Number(req.params.id)));
  res.status(200).json({ success: true, message: "kategori berhasil dihapus" });
});

export default router;