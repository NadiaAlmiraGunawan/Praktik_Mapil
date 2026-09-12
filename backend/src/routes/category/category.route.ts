import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { categories } from '../../config/schema';
import { db } from '../../config/db';

const router = Router();

router.get('/', async (req, res) => {
  const data = await db.select().from(categories);
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const data = await db.select().from(categories).where(eq(categories.id, Number(req.params.id)));
  if (!data.length) return res.status(404).json({ message: 'Not found' });
  res.json(data[0]);
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const result = await db.insert(categories).values({ name });
  res.status(201).json({ id: result[0].insertId, name });
});

router.put('/:id', async (req, res) => {
  const { name } = req.body;
  await db.update(categories).set({ name }).where(eq(categories.id, Number(req.params.id)));
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  await db.delete(categories).where(eq(categories.id, Number(req.params.id)));
  res.json({ message: 'Deleted' });
});

export default router;