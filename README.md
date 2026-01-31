# MINIMAL - Premium E-Commerce Website

A fully responsive, premium e-commerce website built with Next.js 16, TypeScript, and Tailwind CSS featuring a minimalist black and white design.

## Features

### 🎨 Design
- **Minimalist Black & White Theme** - Clean, modern aesthetic
- **Fully Responsive** - Works perfectly on all devices
- **Theme Variables** - Easy color customization via CSS variables
- **Smooth Animations** - Premium micro-interactions and transitions
- **Custom Scrollbar** - Branded scrollbar design

### 🛍️ E-Commerce Features
- **Product Catalog** - Browse products with filtering and sorting
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Full cart management with quantity controls
- **Wishlist** - Save favorite items for later
- **Checkout** - Complete checkout flow with shipping and payment
- **Order Success** - Confirmation page after successful purchase
- **Order History** - View past orders (requires login)

### 🔐 Authentication
- **Login System** - User authentication with form validation
- **Signup System** - New user registration
- **Protected Routes** - Authentication-required pages
- **Persistent Sessions** - State persisted across page reloads

### 📱 User Experience
- **Search Functionality** - Search products (UI ready)
- **Category Browsing** - Shop by category or gender
- **Product Filtering** - Filter by price, category, gender
- **Product Sorting** - Sort by price, name, rating, featured
- **Mobile Menu** - Responsive navigation
- **Loading States** - Smooth loading indicators
- **Empty States** - Helpful messages for empty cart/wishlist

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand with persistence
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Image Optimization:** Next.js Image component

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Build for Production

```bash
npm run build
npm start
```

## Customizing Theme Colors

All theme colors are defined as CSS variables in `src/app/globals.css`. You can easily change the entire color scheme by modifying these variables:

```css
:root {
  /* Primary theme color (default: black) */
  --theme-primary: #000000;
  
  /* Secondary theme color (default: white) */
  --theme-secondary: #ffffff;
  
  /* Accent color for hover states */
  --theme-accent: #1a1a1a;
  
  /* Border color */
  --theme-border: #e5e5e5;
  
  /* Hover background color */
  --theme-hover: #f5f5f5;
  
  /* Text colors */
  --theme-text-primary: #000000;
  --theme-text-secondary: #666666;
  --theme-text-muted: #999999;
}
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── orders/            # Order history page
│   ├── order-success/     # Order confirmation page
│   ├── products/          # Products listing and detail pages
│   ├── wishlist/          # Wishlist page
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles and theme variables
├── components/
│   ├── home/              # Homepage sections
│   ├── layout/            # Header and Footer
│   ├── product/           # Product card component
│   └── ui/                # Reusable UI components
├── data/                  # Mock data
├── store/                 # Zustand state management
└── types/                 # TypeScript interfaces
```

## Pages

- **/** - Homepage with hero, categories, and featured products
- **/products** - Product listing with filters and sorting
- **/products/[id]** - Product detail page
- **/cart** - Shopping cart
- **/wishlist** - Saved items
- **/checkout** - Checkout with shipping and payment
- **/order-success** - Order confirmation
- **/orders** - Order history (requires login)
- **/login** - User login
- **/signup** - User registration

## State Management

The application uses Zustand for state management with three main stores:

1. **Auth Store** - User authentication state
2. **Cart Store** - Shopping cart items and operations
3. **Wishlist Store** - Saved products

All stores are persisted to localStorage for a seamless user experience.

## Future Enhancements

- Backend API integration
- Real payment processing
- User profile management
- Product reviews and ratings
- Advanced search with filters
- Product recommendations
- Email notifications
- Order tracking
- Admin dashboard

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
