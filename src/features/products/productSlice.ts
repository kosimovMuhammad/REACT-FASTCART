import { createSlice } from '@reduxjs/toolkit'
import type { ProductState } from './productTypes'
import { fetchProducts, fetchProductById } from './productThunks'

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  pagination: { totalCount: 0, pageNumber: 1, pageSize: 12 },
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
        state.products = action.payload.products
        state.pagination = {
          totalCount: action.payload.totalRecord,
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.selectedProduct = null
        state.error = action.payload as string
      })
  },
})

export const { clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
