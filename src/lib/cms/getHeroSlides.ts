import dbConnect from '@/lib/dbConnect';
import HeroSlide from '@/models/HeroSlide';
import { serializeHeroSlideList, SerializedHeroSlide } from '@/lib/cms/heroSerializer';

/** Server-side fetch for homepage hero carousel (active slides only). */
export async function getHeroSlides(): Promise<SerializedHeroSlide[]> {
  await dbConnect();
  const slides = await HeroSlide.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return serializeHeroSlideList(slides as unknown as Record<string, unknown>[]);
}

/** Admin: all slides including inactive. */
export async function getAllHeroSlides(): Promise<SerializedHeroSlide[]> {
  await dbConnect();
  const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return serializeHeroSlideList(slides as unknown as Record<string, unknown>[]);
}
