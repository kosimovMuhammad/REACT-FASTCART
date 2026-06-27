import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { Color, ApiResponse } from '@/types'

export const fetchColors = createAsyncThunk(
  'colors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Color[]>>('/Color/get-colors')
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch colors')
    }
  }
)
