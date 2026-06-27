import { createSlice } from '@reduxjs/toolkit'
import type { Color } from '@/types'
import { fetchColors } from './colorThunks'

interface ColorState {
  items: Color[]
  loading: boolean
  error: string | null
}

const initialState: ColorState = {
  items: [],
  loading: false,
  error: null,
}

const colorSlice = createSlice({
  name: 'colors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default colorSlice.reducer
