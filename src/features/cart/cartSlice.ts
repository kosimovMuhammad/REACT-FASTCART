import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CartState } from './cartTypes'
import type { CartItem, Product, RawProductListItem } from '@/types'

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items))
}

const initialState: CartState = {
  items: loadCart(),
  addingToCartIds: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product | RawProductListItem | any; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((i) => i.productId === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        const imageUrl = product.images?.[0]?.imageUrl || product.image || ''
        state.items.push({
          id: product.id,
          productId: product.id,
          productName: product.productName,
          price: product.price,
          discountPrice: product.discountPrice,
          hasDiscount: product.hasDiscount,
          imageUrl: imageUrl,
          quantity: quantity,
          colorId: product.colorId || 0,
          colorName: product.colorName || '',
        })
      }
      saveCart(state.items)
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload && i.productId !== action.payload)
      saveCart(state.items)
    },
    increaseCartItem(state, action: PayloadAction<number>) {
      const existing = state.items.find((i) => i.id === action.payload || i.productId === action.payload)
      if (existing) {
        existing.quantity += 1
        saveCart(state.items)
      }
    },
    reduceCartItem(state, action: PayloadAction<number>) {
      const existing = state.items.find((i) => i.id === action.payload || i.productId === action.payload)
      if (existing && existing.quantity > 1) {
        existing.quantity -= 1
        saveCart(state.items)
      }
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    }
  },
})

export const { addToCart, removeFromCart, increaseCartItem, reduceCartItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
