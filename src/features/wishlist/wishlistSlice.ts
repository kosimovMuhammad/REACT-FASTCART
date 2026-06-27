import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

interface WishlistState {
  items: Product[]
}

const load = (): Product[] => {
  try {
    const raw = localStorage.getItem('wishlist')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const save = (items: Product[]) => {
  localStorage.setItem('wishlist', JSON.stringify(items))
}

const initialState: WishlistState = {
  items: load(),
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.some((p) => p.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
        save(state.items)
      }
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
      save(state.items)
    },
  },
})

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
