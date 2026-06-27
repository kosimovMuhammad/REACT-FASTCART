import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { Category, SubCategory, ApiResponse } from '@/types'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<Category[]>>('/Category/get-categories')
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch categories')
    }
  }
)

export const fetchSubCategories = createAsyncThunk(
  'categories/fetchSubCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<SubCategory[]>>('/SubCategory/get-sub-category')
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch sub-categories')
    }
  }
)
