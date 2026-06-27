import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { LoginRequest, RegisterRequest, ApiResponse } from '@/types'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const { data } = await api.post<ApiResponse<string>>('/Account/login', credentials)
      localStorage.setItem('token', data.data)
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.errors?.[0] ?? 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      await api.post<ApiResponse<null>>('/Account/register', userData)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.errors?.[0] ?? 'Registration failed')
    }
  }
)
