import { createSlice } from '@reduxjs/toolkit'
import type { Category, SubCategory } from '@/types'
import { fetchCategories, fetchSubCategories } from './categoryThunks'

interface CategoryState {
  categories: Category[]
  subCategories: SubCategory[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  subCategories: [],
  loading: false,
  error: null,
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false
        state.subCategories = action.payload
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default categorySlice.reducer
