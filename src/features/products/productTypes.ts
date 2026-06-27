import type { Product } from '@/types'

export interface ProductState {
  products: Product[]
  selectedProduct: Product | null
  pagination: {
    totalCount: number
    pageNumber: number
    pageSize: number
  }
  loading: boolean
  error: string | null
}
