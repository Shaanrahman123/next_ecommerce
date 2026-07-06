import { getCategoryGridItems } from '@/lib/cms/getCategoryGrid';
import CategoryGridView from '@/components/home/CategoryGridView';

export default async function CategoryGrid() {
  const items = await getCategoryGridItems(4);
  return <CategoryGridView items={items} />;
}
