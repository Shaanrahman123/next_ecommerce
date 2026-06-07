'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryService } from '@/services/category.service';
import { CategoryTreeDepartment } from '@/types/category';
import { mainNavigation, megaMenuImages } from '@/data/categories';

export function useCategoryTree() {
  const [tree, setTree] = useState<CategoryTreeDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await categoryService.getTree(true);
      if (res.data && res.data.length > 0) {
        setTree(res.data);
      } else {
        setTree(fallbackFromStatic());
      }
    } catch {
      setTree(fallbackFromStatic());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { tree, isLoading, reload: load };
}

function fallbackFromStatic(): CategoryTreeDepartment[] {
  return mainNavigation
    .filter((nav) => nav.id !== 'sale')
    .map((nav) => ({
      id: nav.id,
      label: nav.label,
      slug: nav.id,
      imageUrl: megaMenuImages[nav.id as keyof typeof megaMenuImages] || megaMenuImages.men,
      basePath: nav.basePath,
      sections: nav.sections.map((section, idx) => ({
        id: `${nav.id}-${idx}`,
        title: section.title,
        slug: section.title.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: section.items[0]?.image || '',
        basePath: section.basePath,
        items: section.items.map((item, itemIdx) => ({
          id: `${nav.id}-${idx}-${itemIdx}`,
          name: item.name,
          slug: item.slug,
          imageUrl: item.image,
        })),
      })),
    }));
}

export function getFeaturedImage(dept: CategoryTreeDepartment) {
  return dept.imageUrl;
}
