# Typography System - Premium E-Commerce

## Overview
This document outlines the standardized typography system for consistent font sizing across all pages.

## Typography Classes

### Page Titles
**Usage:** Main page headings (e.g., "Men's Casual Wear", "Product Details")
- **Mobile:** 24px (1.5rem) - Semibold
- **Desktop:** 40px (2.5rem) - Bold
- **Class:** `text-page-title`
- **Example:** `<h1 className="text-page-title">Men's Casual Wear</h1>`

### Section Titles  
**Usage:** Section headings (e.g., "Featured Products", "New Arrivals")
- **Mobile:** 18px (1.125rem) - Semibold
- **Desktop:** 32px (2rem) - Semibold
- **Class:** `text-section-title`
- **Example:** `<h2 className="text-section-title">Featured Products</h2>`

### Card Titles
**Usage:** Product card names, card headings
- **Mobile:** 14px (0.875rem) - Semibold
- **Desktop:** 18px (1.125rem) - Semibold
- **Class:** `text-card-title`
- **Example:** `<h3 className="text-card-title">{product.name}</h3>`

### Body Text
**Usage:** Descriptions, paragraphs, general content
- **Mobile:** 12px (0.75rem) - Regular
- **Desktop:** 16px (1rem) - Regular
- **Class:** `text-body`
- **Example:** `<p className="text-body">{product.description}</p>`

### Small Text
**Usage:** Labels, captions, metadata
- **Mobile:** 10px (0.625rem) - Regular
- **Desktop:** 14px (0.875rem) - Regular
- **Class:** `text-small`
- **Example:** `<span className="text-small">In Stock</span>`

### Price Text
**Usage:** Product prices
- **Mobile:** 18px (1.125rem) - Semibold
- **Desktop:** 24px (1.5rem) - Bold
- **Class:** `text-price`
- **Example:** `<span className="text-price">₹{price}</span>`

## Implementation Guidelines

### DO:
✅ Use these classes consistently across all pages
✅ Combine with color utilities (e.g., `text-page-title text-gray-900`)
✅ Add text-gray-600 for body text, text-gray-900 for titles
✅ Use for mobile-first responsive design

### DON'T:
❌ Mix custom font sizes with system classes
❌ Override font-weight in individual components
❌ Use arbitrary Tailwind text sizes (text-xl, text-2xl, etc.)

## Page-by-Page Usage

### Home Page
- Hero Title: `text-page-title`
- Section Titles: `text-section-title`
- Product Cards: `text-card-title`
- Descriptions: `text-body`

### Products Page
- Page Title: `text-page-title`
- Product Names: `text-card-title`
- Prices: `text-price`
- Category Labels: `text-small`

### Product Detail Page
- Product Name: `text-page-title`
- Price: `text-price`
- Description: `text-body`
- Labels (Size, Color): `text-small`
- Section Titles (Reviews, Details): `text-section-title`

### Cart/Checkout
- Page Title: `text-page-title`
- Product Names: `text-card-title`
- Prices: `text-price`
- Subtotals/Totals: `text-section-title`
- Helper Text: `text-small`

## Color Combinations

```css
/* Primary Title */
text-page-title text-gray-900

/* Section Title */
text-section-title text-gray-900

/* Card Title */
text-card-title text-gray-900

/* Body Text */
text-body text-gray-600

/* Small/Meta Text */
text-small text-gray-500

/* Price */
text-price text-gray-900
```

## Benefits
- ✅ Consistent visual hierarchy
- ✅ Premium, professional appearance
- ✅ Perfect mobile experience
- ✅ Easy to maintain and update
- ✅ Accessible typography
