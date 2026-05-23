# Next.js E-Commerce Backend API Documentation

This document describes all available backend API endpoints, their HTTP methods, request parameters, response structures, and authorization requirements.

---

## Global Authentication & Security
All authenticated routes rely on **JSON Web Tokens (JWT)** stored in secure, **HTTP-Only cookies**. 

* **Access Token Cookie:** `accessToken` (used for authentication and role authorization).
* **Refresh Token Cookie:** `refreshToken` (used to obtain a new access token when it expires).
* **Role-Based Gates:** 
  * **Public:** Accessible without any authentication.
  * **Protected (Admin):** Restricted to users with `role === 'admin'`. Validated server-side via `accessToken`.

---

## 1. Authentication Routes

### Sign Up
* **Route:** `/api/auth/sign-up`
* **Method:** `POST`
* **Auth Requirement:** Public (None)
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",       // Required only for loginType "direct"
    "phone": "+1234567890",                // Optional
    "loginType": "direct"                  // "direct" | "social" (Defaults to "direct")
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "status": true,
    "message": "Account created successfully",
    "statusCode": 201,
    "data": {
      "_id": "603d2e3f538e1a0015b67a01",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "loginType": "direct",
      "role": "user"
    }
  }
  ```

### Login
* **Route:** `/api/auth/login`
* **Method:** `POST`
* **Auth Requirement:** Public (None)
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123",       // Required only for loginType "direct"
    "loginType": "direct"                  // "direct" | "social"
  }
  ```
* **Success Response (200 OK):**
  * Sets `accessToken` and `refreshToken` cookies in HTTP-Only mode.
  ```json
  {
    "status": true,
    "message": "Login successful",
    "statusCode": 200,
    "data": {
      "id": "603d2e3f538e1a0015b67a01",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
  ```

### Logout
* **Route:** `/api/auth/logout`
* **Method:** `POST`
* **Auth Requirement:** Protected (User / Admin)
* **Headers:** None (Uses cookie session)
* **Success Response (200 OK):**
  * Clears `accessToken` and `refreshToken` cookies.
  ```json
  {
    "status": true,
    "message": "Logged out successfully",
    "statusCode": 200
  }
  ```

### Refresh Token
* **Route:** `/api/auth/refresh`
* **Method:** `POST`
* **Auth Requirement:** Public (reads `refreshToken` cookie)
* **Success Response (200 OK):**
  * Re-signs and sets a new `accessToken` cookie.
  ```json
  {
    "status": true,
    "message": "Token refreshed successfully",
    "statusCode": 200
  }
  ```

### Forgot Password (Send OTP)
* **Route:** `/api/auth/forgot-password`
* **Method:** `POST`
* **Auth Requirement:** Public (None)
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Verification code sent to your email",
    "statusCode": 200
  }
  ```

### Verify OTP
* **Route:** `/api/auth/verify-otp`
* **Method:** `POST`
* **Auth Requirement:** Public (None)
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Verification code verified successfully",
    "statusCode": 200,
    "token": "verification-jwt-token-to-be-sent-to-reset-password"
  }
  ```

### Reset Password
* **Route:** `/api/auth/reset-password`
* **Method:** `POST`
* **Auth Requirement:** Public (uses token returned by Verify OTP)
* **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "token": "verification-jwt-token",
    "password": "newSecurePassword123"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Password has been reset successfully",
    "statusCode": 200
  }
  ```

---

## 2. Super Category Routes

### Get Paginated List (Public)
* **Route:** `/api/super-category`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Query Parameters:**
  * `page` (optional, default: `1`)
  * `limit` (optional, default: `10`)
  * `search` (optional, searches matches on `name`)
  * `isActive` (optional, `"true"` | `"false"`)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Super Category fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "_id": "603d2e3f538e1a0015b67a10",
        "name": "Footwear",
        "slug": "footwear",
        "description": "Men and women shoes",
        "image": "super_categories/footwear_img",
        "isActive": true,
        "createdAt": "2026-05-23T08:00:00Z",
        "updatedAt": "2026-05-23T08:00:00Z"
      }
    ],
    "meta": {
      "totalDocs": 1,
      "limit": 10,
      "page": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

### Create Super Category (Admin Only)
* **Route:** `/api/super-category`
* **Method:** `POST`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:**
  ```json
  {
    "name": "Footwear",
    "description": "Men and women shoes",          // Optional
    "image": "data:image/png;base64,...",          // Optional base64 or file buffer (uploaded to Cloudinary)
    "isActive": true,                              // Optional, default: true
    "slug": "custom-slug-name"                     // Optional, auto-generated from name if omitted
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "status": true,
    "message": "Super Category created successfully",
    "statusCode": 201,
    "data": {
      "_id": "603d2e3f538e1a0015b67a10",
      "name": "Footwear",
      "slug": "footwear",
      "description": "Men and women shoes",
      "image": "super_categories/footwear_img_abc123", // Cloudinary public_id stored
      "isActive": true
    }
  }
  ```

### Get Single Super Category Detail (Public)
* **Route:** `/api/super-category/[id]`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Super Category fetched successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67a10",
      "name": "Footwear",
      "slug": "footwear",
      "description": "Men and women shoes",
      "image": "super_categories/footwear_img_abc123",
      "isActive": true
    }
  }
  ```

### Update Super Category (Admin Only)
* **Route:** `/api/super-category/[id]`
* **Method:** `PUT`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:** (All fields optional)
  ```json
  {
    "name": "Updated Footwear",
    "description": "Updated description",
    "image": "data:image/png;base64,...",          // Send new base64 to replace, or existing public_id string to keep
    "isActive": false,
    "slug": "new-slug"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Super Category updated successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67a10",
      "name": "Updated Footwear",
      "slug": "updated-footwear",
      "description": "Updated description",
      "image": "super_categories/updated_img_xyz987",
      "isActive": false
    }
  }
  ```

### Delete Super Category (Admin Only)
* **Route:** `/api/super-category/[id]`
* **Method:** `DELETE`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Super Category deleted successfully",
    "statusCode": 200
  }
  ```

---

## 3. Category Routes (Multi-Parent)

### Get Paginated List (Public)
* **Route:** `/api/category`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Query Parameters:**
  * `page` (optional, default: `1`)
  * `limit` (optional, default: `10`)
  * `search` (optional, searches matches on category `name`)
  * `isActive` (optional, `"true"` | `"false"`)
  * `superCategory` (optional, filters categories containing this SuperCategory ID in their parents list)
* **Success Response (200 OK):**
  * Populates parent list details inside `superCategories`.
  ```json
  {
    "status": true,
    "message": "Category fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "_id": "603d2e3f538e1a0015b67b20",
        "name": "Activewear",
        "slug": "activewear",
        "description": "Sports and workout clothing",
        "image": "categories/activewear_abc123",
        "isActive": true,
        "superCategories": [
          {
            "_id": "603d2e3f538e1a0015b67a10",
            "name": "Footwear",
            "slug": "footwear",
            "isActive": true
          }
        ],
        "createdAt": "2026-05-23T08:10:00Z"
      }
    ],
    "meta": {
      "totalDocs": 1,
      "limit": 10,
      "page": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

### Create Category (Admin Only)
* **Route:** `/api/category`
* **Method:** `POST`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:**
  ```json
  {
    "name": "Activewear",
    "superCategories": ["603d2e3f538e1a0015b67a10"],  // Array of valid SuperCategory IDs (required, min length 1)
    "description": "Workout apparel",                  // Optional
    "image": "data:image/png;base64,...",              // Optional base64/file buffer
    "isActive": true,                                  // Optional, default: true
    "slug": "custom-slug"                              // Optional
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "status": true,
    "message": "Category created successfully",
    "statusCode": 201,
    "data": {
      "_id": "603d2e3f538e1a0015b67b20",
      "name": "Activewear",
      "slug": "activewear",
      "description": "Workout apparel",
      "image": "categories/activewear_abc123",
      "isActive": true,
      "superCategories": [
        {
          "_id": "603d2e3f538e1a0015b67a10",
          "name": "Footwear",
          "slug": "footwear",
          "isActive": true
        }
      ]
    }
  }
  ```

### Get Single Category Detail (Public)
* **Route:** `/api/category/[id]`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Category fetched successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67b20",
      "name": "Activewear",
      "slug": "activewear",
      "description": "Workout apparel",
      "image": "categories/activewear_abc123",
      "isActive": true,
      "superCategories": [
        {
          "_id": "603d2e3f538e1a0015b67a10",
          "name": "Footwear",
          "slug": "footwear",
          "isActive": true
        }
      ]
    }
  }
  ```

### Update Category (Admin Only)
* **Route:** `/api/category/[id]`
* **Method:** `PUT`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:** (All fields optional)
  ```json
  {
    "name": "Updated Activewear",
    "superCategories": ["603d2e3f538e1a0015b67a10", "603d2e3f538e1a0015b67a11"], // Array of valid SuperCategory IDs
    "description": "New description",
    "image": "data:image/png;base64,...",
    "isActive": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Category updated successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67b20",
      "name": "Updated Activewear",
      "slug": "updated-activewear",
      "superCategories": [ ... ]
    }
  }
  ```

### Delete Category (Admin Only)
* **Route:** `/api/category/[id]`
* **Method:** `DELETE`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Category deleted successfully",
    "statusCode": 200
  }
  ```

---

## 4. Sub Category Routes (Multi-Parent)

### Get Paginated List (Public)
* **Route:** `/api/sub-category`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Query Parameters:**
  * `page` (optional, default: `1`)
  * `limit` (optional, default: `10`)
  * `search` (optional, searches matches on subcategory `name`)
  * `isActive` (optional, `"true"` | `"false"`)
  * `superCategory` (optional, filters subcategories belonging to this SuperCategory ID parent)
* **Success Response (200 OK):**
  * Populates parent list details inside `superCategories`.
  ```json
  {
    "status": true,
    "message": "Sub Category fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "_id": "603d2e3f538e1a0015b67c30",
        "name": "Running Shoes",
        "slug": "running-shoes",
        "description": "Athelte footwear",
        "image": "sub_categories/run_shoes_abc123",
        "isActive": true,
        "superCategories": [
          {
            "_id": "603d2e3f538e1a0015b67a10",
            "name": "Footwear",
            "slug": "footwear"
          }
        ]
      }
    ],
    "meta": { ... }
  }
  ```

### Create Sub Category (Admin Only)
* **Route:** `/api/sub-category`
* **Method:** `POST`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:**
  ```json
  {
    "name": "Running Shoes",
    "superCategories": ["603d2e3f538e1a0015b67a10"],  // Array of valid SuperCategory IDs (required, min length 1)
    "description": "Athlete footwear",                 // Optional
    "image": "data:image/png;base64,...",              // Optional
    "isActive": true,
    "slug": "running-shoes"                            // Optional
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "status": true,
    "message": "Sub Category created successfully",
    "statusCode": 201,
    "data": {
      "_id": "603d2e3f538e1a0015b67c30",
      "name": "Running Shoes",
      "slug": "running-shoes",
      "superCategories": [ ... ]
    }
  }
  ```

### Get Single Sub Category Detail (Public)
* **Route:** `/api/sub-category/[id]`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Sub Category fetched successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67c30",
      "name": "Running Shoes",
      "slug": "running-shoes",
      "superCategories": [ ... ]
    }
  }
  ```

### Update Sub Category (Admin Only)
* **Route:** `/api/sub-category/[id]`
* **Method:** `PUT`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:** (All fields optional)
  ```json
  {
    "name": "Updated Running Shoes",
    "superCategories": ["603d2e3f538e1a0015b67a10"],
    "description": "New description",
    "image": "data:image/png;base64,...",
    "isActive": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Sub Category updated successfully",
    "statusCode": 200,
    "data": {
      "_id": "603d2e3f538e1a0015b67c30",
      "name": "Updated Running Shoes",
      "slug": "updated-running-shoes",
      "superCategories": [ ... ]
    }
  }
  ```

### Delete Sub Category (Admin Only)
* **Route:** `/api/sub-category/[id]`
* **Method:** `DELETE`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Sub Category deleted successfully",
    "statusCode": 200
  }
  ```

---

## 5. Product Routes

> **Image Storage Note:** `heroImage` stores a single Cloudinary `public_id` (e.g., `products/abc123`). `images[]` stores an array of `public_id` strings. The frontend is responsible for prepending the Cloudinary base URL from `.env`.

### Get Paginated List (Public)
* **Route:** `/api/product`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Sort Order:** Newest first (`createdAt: -1`)
* **Query Parameters:**
  * `page` (optional, default: `1`)
  * `limit` (optional, default: `10`)
  * `search` (optional, searches `name`, `brand`, `description`)
  * `isActive` (optional, `"true"` | `"false"`)
  * `featured` (optional, `"true"` | `"false"`)
  * `gender` (optional, `"men"` | `"women"` | `"kids"` | `"unisex"`)
  * `superCategory` (optional, SuperCategory ObjectId)
  * `category` (optional, Category ObjectId)
  * `subCategory` (optional, SubCategory ObjectId)
  * `inStock` (optional, `"true"` | `"false"`)
  * `minPrice` (optional, numeric minimum price)
  * `maxPrice` (optional, numeric maximum price)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Product fetched successfully",
    "statusCode": 200,
    "data": [
      {
        "_id": "663d2e3f538e1a0015b67d01",
        "name": "Nike Air Max 270",
        "slug": "nike-air-max-270",
        "description": "Lightweight running shoe with Max Air cushioning",
        "price": 12999,
        "originalPrice": 15999,
        "heroImage": "products/nike_air_max_hero_abc123",
        "images": ["products/nike_side_xyz", "products/nike_top_xyz"],
        "superCategories": [ { "_id": "...", "name": "Footwear" } ],
        "categories": [ { "_id": "...", "name": "Running" } ],
        "subCategories": [ { "_id": "...", "name": "Road Running" } ],
        "inStock": true,
        "stockQuantity": 50,
        "isActive": true,
        "featured": true,
        "gender": "unisex",
        "sizes": ["7", "8", "9", "10", "11"],
        "colors": ["Black/White", "Blue/Red"],
        "brand": "Nike",
        "material": "Mesh upper",
        "season": "All Season",
        "specifications": [
          { "key": "Sole", "value": "Rubber" },
          { "key": "Closure", "value": "Lace-up" }
        ],
        "ratings": 4.5,
        "reviewsCount": 128,
        "createdAt": "2026-05-23T10:00:00Z",
        "updatedAt": "2026-05-23T10:00:00Z"
      }
    ],
    "meta": {
      "totalDocs": 1,
      "limit": 10,
      "page": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

### Create Product (Admin Only)
* **Route:** `/api/product`
* **Method:** `POST`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:**
  ```json
  {
    "name": "Nike Air Max 270",                              // Required
    "price": 12999,                                          // Required
    "heroImage": "data:image/png;base64,...",               // Required – base64 / URL (uploaded to Cloudinary)
    "superCategories": ["663d2e3f538e1a0015b67a10"],        // Required – array of valid SuperCategory IDs (min 1)
    "categories": ["663d2e3f538e1a0015b67b20"],             // Required – array of valid Category IDs (min 1)
    "description": "Lightweight running shoe",              // Optional
    "originalPrice": 15999,                                  // Optional – MRP / crossed-out price
    "images": ["data:image/png;base64,..."],                 // Optional – additional images array
    "subCategories": ["663d2e3f538e1a0015b67c30"],          // Optional – array of SubCategory IDs
    "inStock": true,                                         // Optional, default: true
    "stockQuantity": 50,                                     // Optional, default: 0
    "isActive": true,                                        // Optional, default: true
    "featured": false,                                       // Optional, default: false
    "gender": "unisex",                                      // Optional – "men" | "women" | "kids" | "unisex"
    "sizes": ["7", "8", "9", "10"],                         // Optional
    "colors": ["Black/White", "Blue/Red"],                  // Optional
    "brand": "Nike",                                         // Optional
    "material": "Mesh upper",                               // Optional
    "season": "All Season",                                  // Optional
    "slug": "nike-air-max-270",                              // Optional – auto-generated from name if omitted
    "specifications": [                                      // Optional – key/value pairs
      { "key": "Sole", "value": "Rubber" }
    ]
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "status": true,
    "message": "Product created successfully",
    "statusCode": 201,
    "data": {
      "_id": "663d2e3f538e1a0015b67d01",
      "name": "Nike Air Max 270",
      "slug": "nike-air-max-270",
      "price": 12999,
      "heroImage": "products/nike_air_max_hero_abc123",
      "images": ["products/nike_side_xyz"],
      "superCategories": [ { "_id": "...", "name": "Footwear" } ],
      "categories": [ { "_id": "...", "name": "Running" } ],
      "subCategories": [],
      "brand": "Nike",
      "gender": "unisex",
      "isActive": true,
      "featured": false
    }
  }
  ```
* **Validation Errors (400 Bad Request):**
  * `"Product name is required"` – `name` missing
  * `"Product price is required"` – `price` missing
  * `"Product hero image is required"` – `heroImage` missing
  * `"At least one Super Category is required"` – `superCategories` empty/missing
  * `"At least one Category is required"` – `categories` empty/missing
  * `"One or more referenced Super Categories do not exist"` – invalid ObjectId(s)
  * `"One or more referenced Categories do not exist"` – invalid ObjectId(s)
  * `"One or more referenced Sub Categories do not exist"` – invalid ObjectId(s)
  * `"Another product with this name already exists"` – duplicate name
  * `"Another product with this slug already exists"` – duplicate slug

---

### Get Single Product Detail (Public)
* **Route:** `/api/product/[id]`
* **Method:** `GET`
* **Auth Requirement:** Public (None)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Product fetched successfully",
    "statusCode": 200,
    "data": {
      "_id": "663d2e3f538e1a0015b67d01",
      "name": "Nike Air Max 270",
      "slug": "nike-air-max-270",
      "price": 12999,
      "originalPrice": 15999,
      "heroImage": "products/nike_air_max_hero_abc123",
      "images": ["products/nike_side_xyz", "products/nike_top_xyz"],
      "superCategories": [ { "_id": "...", "name": "Footwear", "slug": "footwear" } ],
      "categories": [ { "_id": "...", "name": "Running", "slug": "running" } ],
      "subCategories": [ { "_id": "...", "name": "Road Running", "slug": "road-running" } ],
      "inStock": true,
      "stockQuantity": 50,
      "isActive": true,
      "featured": true,
      "gender": "unisex",
      "sizes": ["7", "8", "9", "10"],
      "colors": ["Black/White"],
      "brand": "Nike",
      "material": "Mesh upper",
      "season": "All Season",
      "specifications": [ { "key": "Sole", "value": "Rubber" } ],
      "ratings": 4.5,
      "reviewsCount": 128,
      "createdAt": "2026-05-23T10:00:00Z",
      "updatedAt": "2026-05-23T10:00:00Z"
    }
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "status": false,
    "message": "Product not found",
    "statusCode": 404
  }
  ```

### Update Product (Admin Only)
* **Route:** `/api/product/[id]`
* **Method:** `PUT`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Request Body:** (All fields are optional – only send what needs to change)
  ```json
  {
    "name": "Nike Air Max 270 v2",
    "price": 11999,
    "originalPrice": 14999,
    "heroImage": "data:image/png;base64,...",             // Send new base64 to replace, or existing public_id to keep
    "images": ["data:image/png;base64,..."],              // Full replacement of images array
    "superCategories": ["663d2e3f538e1a0015b67a10"],
    "categories": ["663d2e3f538e1a0015b67b20"],
    "subCategories": ["663d2e3f538e1a0015b67c30"],
    "inStock": false,
    "stockQuantity": 0,
    "isActive": true,
    "featured": true,
    "gender": "men",
    "sizes": ["8", "9", "10"],
    "colors": ["Black/Grey"],
    "brand": "Nike",
    "material": "Knit upper",
    "season": "Winter",
    "slug": "nike-air-max-270-v2",
    "specifications": [ { "key": "Sole", "value": "EVA foam" } ]
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Product updated successfully",
    "statusCode": 200,
    "data": {
      "_id": "663d2e3f538e1a0015b67d01",
      "name": "Nike Air Max 270 v2",
      "slug": "nike-air-max-270-v2",
      "price": 11999,
      "heroImage": "products/new_hero_abc456",
      "superCategories": [ { "_id": "...", "name": "Footwear" } ],
      "categories": [ { "_id": "...", "name": "Running" } ],
      "subCategories": [ { "_id": "...", "name": "Road Running" } ]
    }
  }
  ```

### Delete Product (Admin Only)
* **Route:** `/api/product/[id]`
* **Method:** `DELETE`
* **Auth Requirement:** Protected (Admin only, via `accessToken` cookie)
* **Success Response (200 OK):**
  ```json
  {
    "status": true,
    "message": "Product deleted successfully",
    "statusCode": 200
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "status": false,
    "message": "Product not found",
    "statusCode": 404
  }
  ```
