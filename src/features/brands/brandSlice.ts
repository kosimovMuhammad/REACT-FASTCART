import { createSlice } from '@reduxjs/toolkit'
import type { Brand } from '@/types'
import { fetchBrands } from './brandThunks'

interface BrandState {
  items: Brand[]
  loading: boolean
  error: string | null
}

const initialState: BrandState = {
  items: [],
  loading: false,
  error: null,
}

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default brandSlice.reducer
