import { createSlice } from '@reduxjs/toolkit'
import type { AuthState } from './authTypes'
import { loginUser, registerUser } from './authThunks'

function parseUserId(token: string | null): number | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Number(
      payload['nameid'] ?? payload['sub'] ?? payload['id'] ?? 0
    ) || null
  } catch {
    return null
  }
}

const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  token: storedToken,
  userId: parseUserId(storedToken),
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.userId = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload as string
        state.userId = parseUserId(action.payload as string)
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
