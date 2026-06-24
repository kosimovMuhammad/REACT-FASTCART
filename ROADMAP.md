# Fastkar E-Commerce — Implementation Roadmap
# Stack: React + TypeScript + Redux Toolkit + Vite + Tailwind + shadcn/ui
# API: https://store-api.softclub.tj | Design: dark theme, red accent #E11D48

---

## Phase 1 — Project Setup
- [ ] `npm create vite@latest ecommerce-app -- --template react-ts`
- [ ] Install core deps: `@reduxjs/toolkit react-redux react-router-dom axios`
- [ ] Install i18n: `i18next react-i18next i18next-browser-languagedetector`
- [ ] Install UI utilities: `class-variance-authority clsx tailwind-merge lucide-react`
- [ ] Install dev deps: `tailwindcss postcss autoprefixer`
- [ ] Run `npx tailwindcss init -p`
- [ ] Run `npx shadcn-ui@latest init` and add: `button input card badge sheet dialog dropdown-menu separator toast`
- [ ] Configure `vite.config.ts` with `@` alias pointing to `./src`
- [ ] Configure `tsconfig.json` with `paths: { "@/*": ["./src/*"] }`
- [ ] Create `.env` with `VITE_API_URL` and `VITE_IMAGE_URL`

## Phase 2 — Foundation Layer
- [ ] `src/types/index.ts` — all TypeScript interfaces (LoginRequest, RegisterRequest, ApiResponse, Product, ProductImage, Category, SubCategory, Brand, Color, CartItem, UserProfile, PaginatedResponse, ProductFilters)
- [ ] `src/services/api.ts` — Axios instance + request interceptor (attach JWT) + response interceptor (handle 401 → redirect /login)
- [ ] `src/app/store.ts` — configureStore with 6 slices: auth, products, cart, categories, wishlist, user
- [ ] `src/app/hooks.ts` — typed `useAppDispatch` and `useAppSelector`
- [ ] `src/i18n/index.ts` — i18next setup with LanguageDetector
- [ ] `src/i18n/locales/en.json` — English translations (nav, home, product, cart, auth, errors)
- [ ] `src/i18n/locales/tj.json` — Tajik translations (same keys)

## Phase 3 — Redux Feature Slices
- [ ] `src/features/auth/authTypes.ts`
- [ ] `src/features/auth/authThunks.ts` — `loginUser` (POST /Account/login), `registerUser` (POST /Account/register)
- [ ] `src/features/auth/authSlice.ts` — state: token, isAuthenticated, loading, error; actions: logout, clearError
- [ ] `src/features/products/productTypes.ts`
- [ ] `src/features/products/productThunks.ts` — `fetchProducts` (GET /Product/get-products with URLSearchParams), `fetchProductById` (GET /Product/get-product-by-id)
- [ ] `src/features/products/productSlice.ts` — state: products[], selectedProduct, pagination, loading, error
- [ ] `src/features/cart/cartTypes.ts`
- [ ] `src/features/cart/cartThunks.ts` — fetchCart, addToCart, increaseCartItem, reduceCartItem, removeFromCart, clearCart
- [ ] `src/features/cart/cartSlice.ts` — state: items[], loading, error
- [ ] `src/features/categories/categoryThunks.ts` — `fetchCategories` (GET /Category/get-categories)
- [ ] `src/features/categories/categorySlice.ts`
- [ ] `src/features/wishlist/wishlistSlice.ts` — localStorage-backed; actions: addToWishlist, removeFromWishlist
- [ ] `src/features/user/userThunks.ts` — fetch/update user profile
- [ ] `src/features/user/userSlice.ts`

## Phase 4 — Common Components
- [ ] `src/components/common/Loader.tsx` — spinner, supports `fullScreen` prop (fixed overlay)
- [ ] `src/components/common/ErrorBoundary.tsx` — class component, catches render errors, "Try Again" button
- [ ] `src/components/common/ProtectedRoute.tsx` — checks `isAuthenticated`, redirects to /login
- [ ] `src/components/common/ProductCard.tsx` — shows image, name, price, discountPrice; Add to Cart + Wishlist buttons
- [ ] `src/components/common/CategoryCard.tsx` — shows category image + name, links to /products?categoryId=

## Phase 5 — Layout
- [ ] `src/components/layout/Header.tsx` — logo, nav links (i18n), language switcher (EN/TJ), theme toggle, cart icon with badge, auth buttons
- [ ] `src/components/layout/Footer.tsx` — links, social icons
- [ ] `src/components/layout/Layout.tsx` — `<Header /> <Outlet /> <Footer />`

## Phase 6 — Providers & Router
- [ ] `src/providers/ThemeProvider.tsx` — dark/light toggle via `document.documentElement.classList` + localStorage
- [ ] `src/providers/AuthProvider.tsx` — provides isAuthenticated, token, logout via context
- [ ] `src/router/AppRouter.tsx` — BrowserRouter, lazy-loaded pages, Suspense fallback, ProtectedRoute wrapper

## Phase 7 — Pages
- [ ] `src/pages/HomePage.tsx` — Hero, Flash Sales (4 products), Browse Category, Best Selling (products 4-8)
- [ ] `src/pages/ProductsPage.tsx` — filter sidebar (price, brand, color, category), paginated product grid
- [ ] `src/pages/ProductDetailPage.tsx` — image gallery, product info, Add to Cart / Wishlist, related products
- [ ] `src/pages/CartPage.tsx` — items list with increase/reduce/remove, subtotal, Checkout button
- [ ] `src/pages/CheckoutPage.tsx` — order summary + checkout form
- [ ] `src/pages/WishlistPage.tsx` — wishlist grid, remove from wishlist
- [ ] `src/pages/AccountPage.tsx` — user profile view/edit, avatar upload
- [ ] `src/pages/LoginPage.tsx` — split layout (image left, form right), userName + password, error display
- [ ] `src/pages/RegisterPage.tsx` — split layout, 5-field form (userName, phone, email, password, confirmPassword)
- [ ] `src/pages/AboutPage.tsx` — static about content
- [ ] `src/pages/ContactPage.tsx` — contact form
- [ ] `src/pages/NotFoundPage.tsx` — 404 with "Back to Home" link

## Phase 8 — Entry Point & Final Integration
- [ ] `src/main.tsx` — Provider > ThemeProvider > AuthProvider > ErrorBoundary > AppRouter
- [ ] Import `@/i18n` and `@/index.css` in main.tsx
- [ ] Verify dark mode classes in tailwind.config (darkMode: 'class')
- [ ] Final QA: test all routes, auth flow, cart operations, language switch, theme toggle

---

## Notes
- All API calls use `createAsyncThunk` — never raw fetch/axios in components
- JWT token stored in `localStorage` under key `token`; attached via request interceptor
- Wishlist is local-only (localStorage), not synced to API
- Images: `${import.meta.env.VITE_IMAGE_URL}${imageUrl}`
- Red accent: `#E11D48` (Tailwind: `red-600` / `red-700`)
