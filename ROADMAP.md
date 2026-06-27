# Fastkar E-Commerce — Implementation Roadmap
# Stack: React + TypeScript + Redux Toolkit + Vite + Tailwind + shadcn/ui
# API: https://store-api.softclub.tj | Design: dark theme, red accent #E11D48

---

## Phase 1 — Project Setup
- [x] `npm create vite@latest ecommerce-app -- --template react-ts`
- [x] Install core deps: `@reduxjs/toolkit react-redux react-router-dom axios`
- [x] Install i18n: `i18next react-i18next i18next-browser-languagedetector`
- [x] Install UI utilities: `class-variance-authority clsx tailwind-merge lucide-react`
- [x] Install dev deps: `tailwindcss@3 postcss autoprefixer` (pinned to v3 for shadcn compatibility)
- [x] Run `npx tailwindcss init -p`
- [x] Run `npx shadcn-ui@latest init` and add: `button input card badge sheet dialog dropdown-menu separator toast`
- [x] Configure `vite.config.ts` with `@` alias pointing to `./src`
- [x] Configure `tsconfig.json` with `paths: { "@/*": ["./src/*"] }`
- [x] Create `.env` with `VITE_API_URL` and `VITE_IMAGE_URL`

## Phase 2 — Foundation Layer
- [x] `src/types/index.ts` — all TypeScript interfaces (LoginRequest, RegisterRequest, ApiResponse, Product, ProductImage, Category, SubCategory, Brand, Color, CartItem, UserProfile, PaginatedResponse, ProductFilters)
- [x] `src/services/api.ts` — Axios instance + request interceptor (attach JWT) + response interceptor (handle 401 → redirect /login)
- [x] `src/app/store.ts` — configureStore with 6 slices: auth, products, cart, categories, wishlist, user
- [x] `src/app/hooks.ts` — typed `useAppDispatch` and `useAppSelector`
- [x] `src/i18n/index.ts` — i18next setup with LanguageDetector
- [x] `src/i18n/locales/en.json` — English translations (nav, home, product, cart, auth, errors)
- [x] `src/i18n/locales/tj.json` — Tajik translations (same keys)

## Phase 3 — Redux Feature Slices
- [x] `src/features/auth/authTypes.ts`
- [x] `src/features/auth/authThunks.ts` — `loginUser` (POST /Account/login), `registerUser` (POST /Account/register)
- [x] `src/features/auth/authSlice.ts` — state: token, isAuthenticated, loading, error; actions: logout, clearError
- [x] `src/features/products/productTypes.ts`
- [x] `src/features/products/productThunks.ts` — `fetchProducts` (GET /Product/get-products with URLSearchParams), `fetchProductById` (GET /Product/get-product-by-id)
- [x] `src/features/products/productSlice.ts` — state: products[], selectedProduct, pagination, loading, error
- [x] `src/features/cart/cartTypes.ts`
- [x] `src/features/cart/cartThunks.ts` — fetchCart, addToCart, increaseCartItem, reduceCartItem, removeFromCart, clearCart
- [x] `src/features/cart/cartSlice.ts` — state: items[], loading, error
- [x] `src/features/categories/categoryThunks.ts` — `fetchCategories` (GET /Category/get-categories)
- [x] `src/features/categories/categorySlice.ts`
- [x] `src/features/wishlist/wishlistSlice.ts` — localStorage-backed; actions: addToWishlist, removeFromWishlist
- [x] `src/features/user/userThunks.ts` — fetch/update user profile
- [x] `src/features/user/userSlice.ts`

## Phase 4 — Common Components
- [x] `src/components/common/Loader.tsx` — spinner, supports `fullScreen` prop (fixed overlay)
- [x] `src/components/common/ErrorBoundary.tsx` — class component, catches render errors, "Try Again" button
- [x] `src/components/common/ProtectedRoute.tsx` — checks `isAuthenticated`, redirects to /login
- [x] `src/components/common/ProductCard.tsx` — shows image, name, price, discountPrice; Add to Cart + Wishlist buttons
- [x] `src/components/common/CategoryCard.tsx` — shows category image + name, links to /products?categoryId=

## Phase 5 — Layout
- [x] `src/components/layout/Header.tsx` — logo, nav links (i18n), language switcher (EN/TJ), theme toggle, cart icon with badge, auth buttons
- [x] `src/components/layout/Footer.tsx` — links, social icons
- [x] `src/components/layout/Layout.tsx` — `<Header /> <Outlet /> <Footer />`

## Phase 6 — Providers & Router
- [x] `src/providers/ThemeProvider.tsx` — dark/light toggle via `document.documentElement.classList` + localStorage
- [x] `src/providers/AuthProvider.tsx` — provides isAuthenticated, token, logout via context
- [x] `src/router/AppRouter.tsx` — BrowserRouter, lazy-loaded pages, Suspense fallback, ProtectedRoute wrapper

## Phase 7 — Pages
- [x] `src/pages/HomePage.tsx` — Hero, Flash Sales (4 products), Browse Category, Best Selling (products 4-8)
- [x] `src/pages/ProductsPage.tsx` — filter sidebar (price, brand, color, category), paginated product grid
- [x] `src/pages/ProductDetailPage.tsx` — image gallery, product info, Add to Cart / Wishlist, related products
- [x] `src/pages/CartPage.tsx` — items list with increase/reduce/remove, subtotal, Checkout button
- [x] `src/pages/CheckoutPage.tsx` — order summary + checkout form
- [x] `src/pages/WishlistPage.tsx` — wishlist grid, remove from wishlist
- [x] `src/pages/AccountPage.tsx` — user profile view/edit, avatar upload
- [x] `src/pages/LoginPage.tsx` — split layout (image left, form right), userName + password, error display
- [x] `src/pages/RegisterPage.tsx` — split layout, 5-field form (userName, phone, email, password, confirmPassword)
- [x] `src/pages/AboutPage.tsx` — static about content
- [x] `src/pages/ContactPage.tsx` — contact form
- [x] `src/pages/NotFoundPage.tsx` — 404 with "Back to Home" link

## Phase 8 — Entry Point & Final Integration
- [x] `src/main.tsx` — Provider > ThemeProvider > AuthProvider > ErrorBoundary > AppRouter
- [x] Import `@/i18n` and `@/index.css` in main.tsx
- [x] Verify dark mode classes in tailwind.config (darkMode: 'class')
- [x] Final QA: test all routes, auth flow, cart operations, language switch, theme toggle

---

## Notes
- All API calls use `createAsyncThunk` — never raw fetch/axios in components
- JWT token stored in `localStorage` under key `token`; attached via request interceptor
- Wishlist is local-only (localStorage), not synced to API
- Images: `${import.meta.env.VITE_IMAGE_URL}${imageUrl}`
- Red accent: `#E11D48` (Tailwind: `red-600` / `red-700`)
