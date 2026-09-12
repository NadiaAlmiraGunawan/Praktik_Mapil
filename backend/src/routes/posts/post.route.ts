import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { categories } from '../../config/schema';

const router = Router();

router.get('/', async (req, res) => {
  const data = await db.select().from(posts).leftJoin(categories, eq(posts.categoryId, categories.id));
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await db.select().from(posts).leftJoin(categories, eq(posts.categoryId, categories.id)).where(eq(posts.id, Number(req.params.id)));
  if (!data.length) return res.status(404).json({ message: 'Not found' });
  res.json(data[0]);
});

router.post('/', async (req, res) => {
  const { title, content, categoryId, authorId } = req.body;
  const result = await db.insert(posts).values({ title, content, categoryId, authorId });
  res.status(201).json({ id: result[0].insertId, title });
});

router.put('/:id', async (req, res) => {
  const { title, content, categoryId } = req.body;
  await db.update(posts).set({ title, content, categoryId }).where(eq(posts.id, Number(req.params.id)));
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.delete(posts).where(eq(posts.id, Number(req.params.id)));
  res.json({ message: 'Deleted' });
});

export default router;