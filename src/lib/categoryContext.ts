import SuperCategory from '@/models/SuperCategory';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';

export interface CategoryContext {
  departmentId?: string;
  departmentSlug?: string;
  departmentName?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  subCategoryId?: string;
  subCategorySlug?: string;
  subCategoryName?: string;
  pageTitle: string;
  breadcrumb: { label: string; href: string }[];
  /** Departments linked to the current category group (for shared categories). */
  linkedDepartments?: { id: string; slug: string; name: string }[];
}

export async function resolveCategoryContext(params: {
  department?: string | null;
  category?: string | null;
  item?: string | null;
}): Promise<CategoryContext> {
  const breadcrumb: CategoryContext['breadcrumb'] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  let departmentId: string | undefined;
  let departmentSlug: string | undefined;
  let departmentName: string | undefined;
  let categoryId: string | undefined;
  let categorySlug: string | undefined;
  let categoryName: string | undefined;
  let subCategoryId: string | undefined;
  let subCategorySlug: string | undefined;
  let subCategoryName: string | undefined;

  if (params.department) {
    const dept = await SuperCategory.findOne({ slug: params.department, isActive: true });
    if (dept) {
      departmentId = dept._id.toString();
      departmentSlug = dept.slug;
      departmentName = dept.name;
      breadcrumb.push({ label: dept.name, href: `/products?department=${dept.slug}` });
    }
  }

  if (params.category) {
    const catFilter: Record<string, unknown> = { slug: params.category, isActive: true };
    if (departmentId) catFilter.superCategories = departmentId;

    let cat = await Category.findOne(catFilter);
    if (!cat) {
      cat = await Category.findOne({ slug: params.category, isActive: true });
    }
    if (cat) {
      categoryId = cat._id.toString();
      categorySlug = cat.slug;
      categoryName = cat.name;
      breadcrumb.push({
        label: cat.name,
        href: `/products?${departmentSlug ? `department=${departmentSlug}&` : ''}category=${cat.slug}`,
      });
    }
  }

  if (params.item && categoryId) {
    const sub = await SubCategory.findOne({ slug: params.item, category: categoryId, isActive: true });
    if (sub) {
      subCategoryId = sub._id.toString();
      subCategorySlug = sub.slug;
      subCategoryName = sub.name;
      breadcrumb.push({
        label: sub.name,
        href: `/products?${departmentSlug ? `department=${departmentSlug}&` : ''}category=${categorySlug}&item=${sub.slug}`,
      });
    }
  } else if (params.item && !categoryId) {
    const sub = await SubCategory.findOne({ slug: params.item, isActive: true }).populate('category');
    if (sub) {
      subCategoryId = sub._id.toString();
      subCategorySlug = sub.slug;
      subCategoryName = sub.name;
      const cat = sub.category as unknown as { _id: { toString(): string }; slug: string; name: string } | null;
      if (cat) {
        categoryId = cat._id.toString();
        categorySlug = cat.slug;
        categoryName = cat.name;
      }
      breadcrumb.push({ label: sub.name, href: `/products?category=${categorySlug || ''}&item=${sub.slug}` });
    }
  }

  const pageTitle = subCategoryName
    ? subCategoryName
    : categoryName
      ? categoryName
      : departmentName
        ? departmentName
        : 'All Products';

  let linkedDepartments: CategoryContext['linkedDepartments'];
  if (categoryId) {
    const catWithDepts = await Category.findById(categoryId).populate('superCategories');
    const depts = (catWithDepts?.superCategories || []) as unknown as Array<{
      _id: { toString(): string };
      slug: string;
      name: string;
    }>;
    if (depts.length > 0) {
      linkedDepartments = depts.map((d) => ({
        id: d._id.toString(),
        slug: d.slug,
        name: d.name,
      }));
    }
  }

  return {
    departmentId,
    departmentSlug,
    departmentName,
    categoryId,
    categorySlug,
    categoryName,
    subCategoryId,
    subCategorySlug,
    subCategoryName,
    pageTitle,
    breadcrumb,
    linkedDepartments,
  };
}

export async function buildProductFilterFromContext(
  ctx: CategoryContext,
  extra: Record<string, unknown> = {},
  departmentOverride?: string | null
) {
  const filter: Record<string, unknown> = { isActive: true, ...extra };

  const deptSlug = departmentOverride ?? ctx.departmentSlug;

  if (ctx.subCategoryId) {
    filter.subCategories = ctx.subCategoryId;
  } else if (ctx.categoryId) {
    filter.categories = ctx.categoryId;
  }

  if (deptSlug === 'boys' || deptSlug === 'girls') {
    const kidsDept = await SuperCategory.findOne({ slug: 'kids', isActive: true });
    if (kidsDept) filter.superCategories = kidsDept._id.toString();
    filter.gender = 'kids';
  } else if (deptSlug) {
    const dept = await SuperCategory.findOne({ slug: deptSlug, isActive: true });
    if (dept) filter.superCategories = dept._id.toString();
  } else if (ctx.departmentId && !ctx.categoryId && !ctx.subCategoryId) {
    filter.superCategories = ctx.departmentId;
  }

  return filter;
}
