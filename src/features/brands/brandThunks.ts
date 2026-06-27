import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { Brand, ApiResponse } from '@/types'

export const fetchBrands = createAsyncThunk(
  'brands/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Brand[]>>('/Brand/get-brands')
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch brands')
    }
  }
)
