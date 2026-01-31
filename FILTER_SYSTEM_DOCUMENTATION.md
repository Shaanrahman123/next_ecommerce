# Product Filter System - Category-Specific Filters

## Overview
The filter system now dynamically shows relevant filters based on the product category being viewed. Each filter section shows up to 10 options initially, with a "Show More" button to expand and view all options.

## Filter Categories

### 🎽 SHIRTS & TOPWEAR
**Specific Filters:**
1. **SLEEVE TYPE** (6 options)
   - Full Sleeve, Half Sleeve, Short Sleeve, Sleeveless, 3/4 Sleeve, Roll-Up Sleeve

2. **COLLAR TYPE** (7 options)
   - Classic Collar, Mandarin Collar, Spread Collar, Button Down, Band Collar, Cuban Collar, No Collar

3. **FIT TYPE** (7 options)
   - Slim Fit, Regular Fit, Relaxed Fit, Oversized, Tailored Fit, Athletic Fit, Loose Fit

4. **FABRIC** (12 options)
   - Cotton, Cotton Blend, Linen, Polyester, Denim, Silk, Rayon, Lycra Blend, Poly Cotton, Khadi, Chambray, Flannel

5. **PATTERN** (10 options)
   - Solid, Striped, Checked, Printed, Floral, Geometric, Polka Dots, Abstract, Graphic, Camouflage

6. **OCCASION** (7 options)
   - Casual, Formal, Party, Sports, Festive, Office, Travel

---

### 👖 JEANS & BOTTOMWEAR
**Specific Filters:**
1. **FIT TYPE** (7 options)
   - Slim Fit, Regular Fit, Relaxed Fit, Oversized, Tailored Fit, Athletic Fit, Loose Fit

2. **RISE** (3 options)
   - Low Rise, Mid Rise, High Rise

3. **LENGTH** (4 options)
   - Full Length, Cropped, Ankle Length, Shorts

4. **WASH** (6 options)
   - Light Wash, Medium Wash, Dark Wash, Black Wash, Acid Wash, Stone Wash

5. **DISTRESS LEVEL** (4 options)
   - Clean Look, Light Distress, Medium Distress, Heavy Distress

6. **STRETCH** (2 options)
   - Stretchable, Non-Stretch

7. **FABRIC** (12 options)
   - Cotton, Cotton Blend, Linen, Polyester, Denim, Silk, Rayon, Lycra Blend, Poly Cotton, Khadi, Chambray, Flannel

8. **OCCASION** (7 options)
   - Casual, Formal, Party, Sports, Festive, Office, Travel

---

### 👟 FOOTWEAR & SHOES
**Specific Filters:**
1. **SHOE TYPE** (8 options)
   - Sneakers, Formal Shoes, Loafers, Boots, Sandals, Flip Flops, Sports Shoes, Casual Shoes

2. **CLOSURE TYPE** (5 options)
   - Lace-Up, Slip-On, Velcro, Buckle, Zipper

3. **SOLE MATERIAL** (5 options)
   - Rubber, EVA, Leather, PU, TPR

---

### 🎒 ACCESSORIES
**Specific Filters:**
1. **ACCESSORY TYPE** (8 options)
   - Watches, Bags, Wallets, Belts, Sunglasses, Caps & Hats, Ties, Scarves

2. **WATCH TYPE** (4 options) - Shows when viewing watches
   - Analog, Digital, Chronograph, Smart Watch

3. **BAG TYPE** (5 options) - Shows when viewing bags
   - Backpack, Messenger Bag, Duffle Bag, Laptop Bag, Tote Bag

---

### 🌐 COMMON FILTERS (Available for ALL Categories)

1. **BRAND** (12 options)
   - HIGHLANDER, Roadster, Flying Machine, StyleCast, HERE&NOW, Mast & Harbour, Levi's, Nike, Adidas, Puma, U.S. Polo Assn., Allen Solly

2. **PRICE** (Range Slider)
   - Min: ₹180
   - Max: ₹11,000
   - Dual-thumb slider with input fields

3. **COLOR** (12 options)
   - Black, White, Blue, Gray, Green, Navy Blue, Olive, Red, Yellow, Pink, Brown, Beige
   - Displayed with color swatches

4. **DISCOUNT RANGE** (8 options - Radio buttons)
   - 10% and above
   - 20% and above
   - 30% and above
   - 40% and above
   - 50% and above
   - 60% and above
   - 70% and above
   - 80% and above

---

## Features

### ✨ Show More/Less Functionality
- Initially displays **10 options** per filter section
- "Show More" button appears if section has more than 10 options
- Shows count of hidden options (e.g., "Show More (5 more)")
- Click to expand and view all options
- "Show Less" button to collapse back to 10 options

### 🎯 Category Detection
- Automatically detects category from URL parameters
- Supports both `?category=shirts` and `?item=shirts` formats
- Shows only relevant filters for the current category
- Common filters (Brand, Price, Color, Discount) always visible

### 📱 Responsive Design
- Works on both desktop sidebar and mobile drawer
- Maintains state across desktop/mobile views
- Smooth animations and transitions

### 🔄 Filter State Management
- Real-time filter updates
- Clear All functionality
- Individual filter removal
- Persists selections across filter expansions

---

## URL Examples

To see different filters in action, use these URLs:

- **Shirts**: `/products?category=shirts` or `/products?item=shirts`
- **Jeans**: `/products?category=jeans` or `/products?item=jeans`
- **Footwear**: `/products?category=footwear`
- **Accessories**: `/products?category=accessories`
- **Watches**: `/products?item=watches`
- **Bags**: `/products?item=bags`

---

## Technical Implementation

### Filter Definition Structure
```typescript
{
    id: 'filter-id',
    title: 'FILTER TITLE',
    type: 'checkbox' | 'radio' | 'range' | 'color',
    categories: ['shirts', 'topwear'], // Empty array = applies to all
    options: [
        { id: 'option-id', label: 'Option Label', count: 1234 }
    ]
}
```

### Category Matching
- Filters with empty `categories` array apply to ALL product types
- Filters with specific categories only show when viewing those categories
- Multiple categories can be specified per filter (e.g., shirts and topwear)

---

## Future Enhancements

Potential additions:
- Size filters (S, M, L, XL, XXL)
- Material-specific filters for accessories
- Gender filters
- Age group filters
- Sustainability filters (Organic, Recycled, etc.)
- Customer ratings filter
- New arrivals filter
- Best sellers filter
