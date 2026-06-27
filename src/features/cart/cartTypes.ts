import type { CartItem } from '@/types'

export interface CartState {
  items: CartItem[]
  addingToCartIds: number[]  // productIds currently being added
  loading: boolean
  error: string | null
}
