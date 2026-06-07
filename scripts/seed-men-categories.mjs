/**
 * Seeds Men's department with standard e-commerce category structure.
 * Run: npm run seed:categories
 */

import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* use existing env */
  }
}

loadEnv();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is required in .env');
  process.exit(1);
}

const SuperCategorySchema = new mongoose.Schema(
  { name: String, slug: String, description: String, image: String, isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 } },
  { timestamps: true }
);
const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    superCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SuperCategory' }],
  },
  { timestamps: true }
);
const SubCategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

const SuperCategory = mongoose.models.SuperCategory || mongoose.model('SuperCategory', SuperCategorySchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema);

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
}

const MEN_STRUCTURE = {
  department: { name: 'Men', slug: 'men', sortOrder: 1 },
  groups: [
    {
      name: 'Topwear',
      slug: 'topwear',
      sortOrder: 1,
      items: ['Shirts', 'T-Shirts', 'Polo Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Hoodies', 'Jackets', 'Blazers', 'Kurtas', 'Ethnic Wear', 'Sweaters'],
    },
    {
      name: 'Bottomwear',
      slug: 'bottomwear',
      sortOrder: 2,
      items: ['Jeans', 'Trousers', 'Formal Pants', 'Chinos', 'Shorts', 'Track Pants', 'Joggers'],
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      sortOrder: 3,
      items: ['Casual Shoes', 'Formal Shoes', 'Sneakers', 'Sports Shoes', 'Sandals', 'Flip Flops', 'Boots'],
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      sortOrder: 4,
      items: ['Belts', 'Wallets', 'Sunglasses', 'Watches', 'Caps & Hats', 'Ties', 'Socks', 'Perfumes', 'Bags'],
    },
  ],
};

async function main() {
  await mongoose.connect(MONGO_URI);

  let men = await SuperCategory.findOne({ slug: 'men' });
  if (!men) {
    men = await SuperCategory.create(MEN_STRUCTURE.department);
    console.log('Created department: Men');
  } else {
    console.log('Department Men already exists — syncing groups/items');
  }

  for (const group of MEN_STRUCTURE.groups) {
    let cat = await Category.findOne({ slug: group.slug });
    if (!cat) {
      cat = await Category.create({
        name: group.name,
        slug: group.slug,
        sortOrder: group.sortOrder,
        isActive: true,
        superCategories: [men._id],
      });
      console.log(`  Created group: ${group.name}`);
    } else if (!cat.superCategories.some((id) => id.toString() === men._id.toString())) {
      cat.superCategories.push(men._id);
      await cat.save();
    }

    for (let i = 0; i < group.items.length; i++) {
      const itemName = group.items[i];
      const itemSlug = slugify(itemName);
      const exists = await SubCategory.findOne({ category: cat._id, slug: itemSlug });
      if (!exists) {
        await SubCategory.create({
          name: itemName,
          slug: itemSlug,
          category: cat._id,
          sortOrder: i + 1,
          isActive: true,
        });
        console.log(`    + ${itemName}`);
      }
    }
  }

  console.log('\nDone! Visit /admin/dashboard/categories to manage or upload images.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
