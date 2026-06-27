# 🛒 E-Commerce TZ — React + TypeScript + Redux Toolkit

**API:** `https://store-api.softclub.tj`  
**Design:** Figma (dark theme, red accent `#E11D48`, black/white)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── store.ts
│   ├── hooks.ts
│   └── rootReducer.ts
├── assets/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── common/
│   │   ├── ProductCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── Loader.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ProtectedRoute.tsx
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authThunks.ts
│   │   └── authTypes.ts
│   ├── products/
│   │   ├── productSlice.ts
│   │   ├── productThunks.ts
│   │   └── productTypes.ts
│   ├── cart/
│   │   ├── cartSlice.ts
│   │   ├── cartThunks.ts
│   │   └── cartTypes.ts
│   ├── categories/
│   │   ├── categorySlice.ts
│   │   ├── categoryThunks.ts
│   │   └── categoryTypes.ts
│   ├── wishlist/
│   │   ├── wishlistSlice.ts
│   │   └── wishlistTypes.ts
│   └── user/
│       ├── userSlice.ts
│       ├── userThunks.ts
│       └── userTypes.ts
├── pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── WishlistPage.tsx
│   ├── AccountPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── NotFoundPage.tsx
├── providers/
│   ├── AuthProvider.tsx
│   └── ThemeProvider.tsx
├── router/
│   └── AppRouter.tsx
├── services/
│   └── api.ts                 # Axios instance + interceptors
├── hooks/
│   ├── useAuth.ts
│   └── useTheme.ts
├── i18n/
│   ├── index.ts
│   ├── locales/
│   │   ├── en.json
│   │   └── tj.json
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## ⚙️ 1. Setup Commands

```bash
# Create project
npm create vite@latest ecommerce-app -- --template react-ts
cd ecommerce-app

# Core dependencies
npm install @reduxjs/toolkit react-redux
npm install react-router-dom
npm install axios
npm install i18next react-i18next i18next-browser-languagedetector
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# shadcn/ui setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge sheet dialog
npx shadcn-ui@latest add dropdown-menu separator toast
```

---

## ⚙️ 2. vite.config.ts (alias)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## ⚙️ 3. .env

```env
VITE_API_URL=https://store-api.softclub.tj
VITE_IMAGE_URL=https://store-api.softclub.tj/Images/
```

---

## 🌐 4. services/api.ts — Axios + JWT Interceptors

```ts
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 🗂️ 5. types/index.ts

```ts
// Auth
export interface LoginRequest {
  userName: string
  password: string
}

export interface RegisterRequest {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  data: T
  errors: string[]
  statusCode: number
}

// Product
export interface Product {
  id: number
  productName: string
  description: string
  price: number
  discountPrice?: number
  hasDiscount: boolean
  quantity: number
  weight?: string
  size?: string
  code: string
  brandId: number
  colorId: number
  subCategoryId: number
  images: ProductImage[]
}

export interface ProductImage {
  id: number
  imageUrl: string
}

// Category
export interface Category {
  id: number
  categoryName: string
  categoryImage: string
  subCategories: SubCategory[]
}

export interface SubCategory {
  id: number
  subCategoryName: string
}

// Brand
export interface Brand {
  id: number
  brandName: string
}

// Color
export interface Color {
  id: number
  colorName: string
}

// Cart
export interface CartItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  imageUrl: string
}

// User
export interface UserProfile {
  id: string
  userName: string
  firstName?: string
  lastName?: string
  email: string
  phoneNumber: string
  dob?: string
  image?: string
}

// Pagination
export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRecord: number
  data: T[]
  errors: string[]
  statusCode: number
}

// Product filters
export interface ProductFilters {
  productName?: string
  minPrice?: number
  maxPrice?: number
  brandId?: number
  colorId?: number
  categoryId?: number
  subcategoryId?: number
  pageNumber?: number
  pageSize?: number
}
```

---

## 🏪 6. app/store.ts

```ts
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import productReducer from '@/features/products/productSlice'
import cartReducer from '@/features/cart/cartSlice'
import categoryReducer from '@/features/categories/categorySlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import userReducer from '@/features/user/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

---

## 🎣 7. app/hooks.ts

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

---

## 🔐 8. features/auth/authThunks.ts

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import type { LoginRequest, RegisterRequest, ApiResponse } from '@/types'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiResponse<string>>('/Account/login', credentials)
      if (data.statusCode === 200) {
        localStorage.setItem('token', data.data)
        return data.data
      }
      return rejectWithValue(data.errors[0])
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiResponse<null>>('/Account/register', userData)
      if (data.statusCode === 200) return true
      return rejectWithValue(data.errors[0])
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Register failed')
    }
  }
)
```

---

## 🔐 9. features/auth/authSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit'
import { loginUser, registerUser } from './authThunks'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
```

---

## 🛍️ 10. features/products/productThunks.ts

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import type { Product, PaginatedResponse, ApiResponse, ProductFilters } from '@/types'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters: ProductFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined) params.append(key, String(val))
      })
      const { data } = await api.get<PaginatedResponse<Product>>(
        `/Product/get-products?${params}`
      )
      return data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Product>>(`/Product/get-product-by-id?id=${id}`)
      return data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Product not found')
    }
  }
)
```

---

## 🛍️ 11. features/products/productSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit'
import { fetchProducts, fetchProductById } from './productThunks'
import type { Product, PaginatedResponse } from '@/types'

interface ProductState {
  products: Product[]
  selectedProduct: Product | null
  pagination: Omit<PaginatedResponse<Product>, 'data'> | null
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  pagination: null,
  loading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.data
        const { data, ...rest } = action.payload
        state.pagination = rest
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
```

---

## 🛒 12. features/cart/cartThunks.ts

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import type { CartItem, ApiResponse } from '@/types'

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<CartItem[]>>('/Cart/get-products-from-cart')
      return data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/add',
  async (productId: number, { rejectWithValue }) => {
    try {
      await api.post(`/Cart/add-product-to-cart?id=${productId}`)
      return productId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors?.[0] || 'Failed to add to cart')
    }
  }
)

export const increaseCartItem = createAsyncThunk(
  'cart/increase',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.put(`/Cart/increase-product-in-cart?id=${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue('Failed to increase')
    }
  }
)

export const reduceCartItem = createAsyncThunk(
  'cart/reduce',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.put(`/Cart/reduce-product-in-cart?id=${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue('Failed to reduce')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/Cart/delete-product-from-cart?id=${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue('Failed to remove')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/Cart/clear-cart')
    } catch (error: any) {
      return rejectWithValue('Failed to clear cart')
    }
  }
)
```

---

## 🛒 13. features/cart/cartSlice.ts

```ts
import { createSlice } from '@reduxjs/toolkit'
import type { CartItem } from '@/types'
import { fetchCart, addToCart, removeFromCart, clearCart, increaseCartItem, reduceCartItem } from './cartThunks'

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload)
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
      })
  },
})

export default cartSlice.reducer
```

---

## 📦 14. features/categories/categoryThunks.ts

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api'
import type { Category, ApiResponse } from '@/types'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Category[]>>('/Category/get-categories')
      return data.data
    } catch (error: any) {
      return rejectWithValue('Failed to fetch categories')
    }
  }
)
```

---

## ❤️ 15. features/wishlist/wishlistSlice.ts

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

interface WishlistState {
  items: Product[]
}

const initialState: WishlistState = {
  items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find((i) => i.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
  },
})

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
```

---

## 🌍 16. i18n/index.ts

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import tj from './locales/tj.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tj: { translation: tj },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
```

---

## 🌍 17. i18n/locales/en.json

```json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "wishlist": "Wishlist",
    "cart": "Cart",
    "account": "Account",
    "about": "About",
    "contact": "Contact",
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  },
  "home": {
    "hero_title": "Enhance Your Music Experience",
    "hero_subtitle": "Up to 10% off Voucher",
    "shop_now": "Shop Now",
    "flash_sales": "Flash Sales",
    "browse_category": "Browse By Category",
    "best_selling": "Best Selling Products",
    "explore_products": "Explore Our Products",
    "new_arrival": "New Arrival"
  },
  "product": {
    "add_to_cart": "Add to Cart",
    "add_to_wishlist": "Add to Wishlist",
    "buy_now": "Buy Now",
    "in_stock": "In Stock",
    "out_of_stock": "Out of Stock",
    "description": "Description",
    "reviews": "Reviews"
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": "Your cart is empty",
    "subtotal": "Subtotal",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "continue": "Continue Shopping"
  },
  "auth": {
    "login_title": "Log In to Exclusive",
    "register_title": "Create an account",
    "username": "Username",
    "email": "Email",
    "phone": "Phone Number",
    "password": "Password",
    "confirm_password": "Confirm Password",
    "login_btn": "Log In",
    "register_btn": "Create Account",
    "no_account": "Don't have an account?",
    "have_account": "Already have an account?"
  },
  "errors": {
    "not_found": "Page Not Found",
    "not_found_desc": "The page you are looking for doesn't exist.",
    "go_home": "Back to Home"
  }
}
```

---

## 🌍 18. i18n/locales/tj.json

```json
{
  "nav": {
    "home": "Асосӣ",
    "products": "Маҳсулот",
    "wishlist": "Рӯйхати хоҳиш",
    "cart": "Сабад",
    "account": "Аккаунт",
    "about": "Дар бораи мо",
    "contact": "Тамос",
    "login": "Воридшавӣ",
    "register": "Бақайдгирӣ",
    "logout": "Хуруҷ"
  },
  "home": {
    "hero_title": "Таҷрибаи мусиқии худро беҳтар кунед",
    "hero_subtitle": "То 10% тахфиф",
    "shop_now": "Харид кунед",
    "flash_sales": "Фурӯши Flash",
    "browse_category": "Аз рӯи категория",
    "best_selling": "Беҳтарин маҳсулот",
    "explore_products": "Маҳсулотро кашф кунед",
    "new_arrival": "Тозавардаҳо"
  },
  "product": {
    "add_to_cart": "Ба сабад иловакунӣ",
    "add_to_wishlist": "Ба рӯйхат иловакунӣ",
    "buy_now": "Ҳозир харед",
    "in_stock": "Дар захира",
    "out_of_stock": "Дар захира нест",
    "description": "Тавсиф",
    "reviews": "Баррасиҳо"
  },
  "cart": {
    "title": "Сабади харид",
    "empty": "Сабади шумо холӣ аст",
    "subtotal": "Ҷамъи миёна",
    "total": "Ҷамъи умумӣ",
    "checkout": "Пардохт",
    "continue": "Харидро давом диҳед"
  },
  "auth": {
    "login_title": "Ба Exclusive ворид шавед",
    "register_title": "Аккаунт эҷод кунед",
    "username": "Номи корбар",
    "email": "Почтаи электронӣ",
    "phone": "Рақами телефон",
    "password": "Рамз",
    "confirm_password": "Тасдиқи рамз",
    "login_btn": "Ворид шавед",
    "register_btn": "Аккаунт эҷод кунед",
    "no_account": "Аккаунт надоред?",
    "have_account": "Аккаунт доред?"
  },
  "errors": {
    "not_found": "Саҳифа ёфт нашуд",
    "not_found_desc": "Саҳифаи дархостшуда вуҷуд надорад.",
    "go_home": "Ба асосӣ баргардед"
  }
}
```

---

## 🛡️ 19. providers/AuthProvider.tsx

```tsx
import React, { createContext, useContext, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be inside AuthProvider')
  return context
}
```

---

## 🛡️ 20. components/common/ProtectedRoute.tsx

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
```

---

## ⚠️ 21. components/common/ErrorBoundary.tsx

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
          <p className="text-gray-500 mt-2">{this.state.error?.message}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
```

---

## ⏳ 22. components/common/Loader.tsx

```tsx
const Loader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default Loader
```

---

## 🗺️ 23. router/AppRouter.tsx

```tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import Loader from '@/components/common/Loader'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default AppRouter
```

---

## 🏠 24. pages/HomePage.tsx

```tsx
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productThunks'
import { fetchCategories } from '@/features/categories/categoryThunks'
import { useTranslation } from 'react-i18next'
import ProductCard from '@/components/common/ProductCard'
import CategoryCard from '@/components/common/CategoryCard'
import Loader from '@/components/common/Loader'

const HomePage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { products, loading } = useAppSelector((s) => s.products)
  const { categories } = useAppSelector((s) => s.categories)

  useEffect(() => {
    dispatch(fetchProducts({ pageSize: 8 }))
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-green-400 mb-2">Categories</p>
            <h1 className="text-5xl font-bold mb-4">{t('home.hero_title')}</h1>
            <p className="text-red-500 text-xl mb-6">{t('home.hero_subtitle')}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-medium">
              {t('home.shop_now')} →
            </button>
          </div>
        </div>
      </section>

      {/* Flash Sales */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-4 h-8 bg-red-600 rounded" />
          <h2 className="text-2xl font-bold">{t('home.flash_sales')}</h2>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-4 h-8 bg-red-600 rounded" />
          <h2 className="text-2xl font-bold">{t('home.browse_category')}</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* Best Selling */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-4 h-8 bg-red-600 rounded" />
          <h2 className="text-2xl font-bold">{t('home.best_selling')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(4, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  )
}

export default HomePage
```

---

## 🔐 25. pages/LoginPage.tsx

```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginUser } from '@/features/auth/authThunks'
import { useTranslation } from 'react-i18next'

const LoginPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [form, setForm] = useState({ userName: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side image */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center">
        <div className="text-white text-4xl font-bold">🛒 Exclusive</div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">{t('auth.login_title')}</h1>
          <p className="text-gray-500 mb-8">Enter your details below</p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('auth.username')}
              className="w-full border-b-2 border-gray-300 focus:border-red-500 outline-none py-2 bg-transparent"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder={t('auth.password')}
              className="w-full border-b-2 border-gray-300 focus:border-red-500 outline-none py-2 bg-transparent"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : t('auth.login_btn')}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-red-600 hover:underline">
              {t('nav.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
```

---

## 🔐 26. pages/RegisterPage.tsx

```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { registerUser } from '@/features/auth/authThunks'
import { useTranslation } from 'react-i18next'

const RegisterPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [form, setForm] = useState({
    userName: '', phoneNumber: '', email: '',
    password: '', confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      navigate('/login')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center">
        <div className="text-white text-4xl font-bold">🛒 Exclusive</div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">{t('auth.register_title')}</h1>
          <p className="text-gray-500 mb-8">Enter your details below</p>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'userName', placeholder: t('auth.username'), type: 'text' },
              { name: 'phoneNumber', placeholder: t('auth.phone'), type: 'tel' },
              { name: 'email', placeholder: t('auth.email'), type: 'email' },
              { name: 'password', placeholder: t('auth.password'), type: 'password' },
              { name: 'confirmPassword', placeholder: t('auth.confirm_password'), type: 'password' },
            ].map((field) => (
              <input
                key={field.name}
                {...field}
                className="w-full border-b-2 border-gray-300 focus:border-red-500 outline-none py-2 bg-transparent"
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : t('auth.register_btn')}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="text-red-600 hover:underline">{t('nav.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
```

---

## 🚫 27. pages/NotFoundPage.tsx

```tsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700">404</h1>
      <h2 className="text-2xl font-bold mt-4">{t('errors.not_found')}</h2>
      <p className="text-gray-500 mt-2">{t('errors.not_found_desc')}</p>
      <Link
        to="/"
        className="mt-6 bg-red-600 text-white px-8 py-3 rounded hover:bg-red-700"
      >
        {t('errors.go_home')}
      </Link>
    </div>
  )
}

export default NotFoundPage
```

---

## 🌙 28. providers/ThemeProvider.tsx

```tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
```

---

## 🚀 29. main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AppRouter from '@/router/AppRouter'
import '@/i18n'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
```

---

## 📋 30. tsconfig paths (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📄 Pages Summary

| Page | Route | Protected | Redux Slice |
|------|-------|-----------|-------------|
| HomePage | `/` | ❌ | products, categories |
| ProductsPage | `/products` | ❌ | products |
| ProductDetailPage | `/products/:id` | ❌ | products |
| CartPage | `/cart` | ✅ | cart |
| CheckoutPage | `/checkout` | ✅ | cart |
| WishlistPage | `/wishlist` | ✅ | wishlist |
| AccountPage | `/account` | ✅ | user |
| LoginPage | `/login` | ❌ | auth |
| RegisterPage | `/register` | ❌ | auth |
| AboutPage | `/about` | ❌ | — |
| ContactPage | `/contact` | ❌ | — |
| NotFoundPage | `*` | ❌ | — |

---

## 🔑 Key Patterns

- **createAsyncThunk** — барои ҳар API call
- **JWT interceptor** — token автоматӣ attach мешавад
- **ProtectedRoute** — `isAuthenticated` чек мекунад
- **ErrorBoundary** — ҳамаро мепӯшад
- **lazy + Suspense** — ҳар page lazy-load
- **i18next** — `en` ва `tj` забонҳо
- **dark/light** — `ThemeProvider` + `localStorage`
- **alias `@`** — `vite.config.ts` + `tsconfig.json`
- **.env** — `VITE_API_URL` барои base URL


---

## 🚀 Автоматизация Git (Git Automation Rules)

- Перед завершением каждого шага: Как только ты полностью заканчиваешь верстку, логику или адаптив любой из страниц, представленных на холсте макета (SignUp, Login, Home, Wishlist, Product Details, Cart, Checkout, Account, About, Contact, 404), обязательно запускай полную проверку проекта через npm run lint и npm run type-check.
- Автоматический коммит и пуш: Если сборка и линтер прошли без единой ошибки, ты обязан самостоятельно, не дожидаясь подтверждения пользователя, выполнить в терминале:
  1. git add .
  2. git commit -m "feat: реализована страница [Название страницы] по макету и правилам Taste Skill с полным адаптивом"
  3. git push origin main
- Завершение: Только после успешного выполнения git push ты имеешь право остановить текущую итерацию, подробно расписать, какие компоненты и фичи были добавлены, и ожидать следующей задачи от пользователя.

