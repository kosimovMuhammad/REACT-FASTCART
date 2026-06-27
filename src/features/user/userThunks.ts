import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { UserProfile, ApiResponse } from '@/types'

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { userId?: number } }
      const id = state.auth.userId ?? 0
      const { data } = await api.get<ApiResponse<UserProfile>>(
        `/UserProfile/get-user-profile-by-id?id=${id}`
      )
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch profile')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profile: Partial<UserProfile> & { avatar?: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      Object.entries(profile).forEach(([key, value]) => {
        if (key !== 'avatar' && value != null) {
          formData.append(key, String(value))
        }
      })
      if (profile.avatar) {
        formData.append('avatar', profile.avatar)
      }
      const { data } = await api.put<ApiResponse<UserProfile>>(
        '/UserProfile/update-user-profile',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update profile')
    }
  }
)
