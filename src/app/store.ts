import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import productsReducer from '@/features/products/productSlice'
import cartReducer from '@/features/cart/cartSlice'
import categoriesReducer from '@/features/categories/categorySlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import userReducer from '@/features/user/userSlice'
import brandsReducer from '@/features/brands/brandSlice'
import colorsReducer from '@/features/colors/colorSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    brands: brandsReducer,
    colors: colorsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
