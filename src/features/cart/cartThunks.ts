import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type { CartItem, RawCartItem, ApiResponse } from '@/types'

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<RawCartItem[]>>('/Cart/get-products-from-cart')
      console.log('[fetchCart] raw response:', data)
      const raw: RawCartItem[] = data.data ?? []
      const items: CartItem[] = raw.map((r) => ({
        id: r.id,
        productId: r.productId,
        productName: r.product?.productName ?? '',
        price: r.product?.price ?? 0,
        discountPrice: r.product?.discountPrice ?? 0,
        hasDiscount: r.product?.hasDiscount ?? false,
        imageUrl: r.product?.images?.[0]?.imageUrl ?? '',
        quantity: r.quantity,
        colorId: r.colorId ?? 0,
        colorName: r.colorName ?? '',
      }))
      return items
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch cart')
    }
  }
)

// Always POSTs — server handles "already in cart → increase" logic.
export const addToCart = createAsyncThunk(
  'cart/add',
  async (productId: number, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/Cart/add-product-to-cart?id=${productId}`)
      dispatch(fetchCart())
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to add to cart')
    }
  }
)

export const increaseCartItem = createAsyncThunk(
  'cart/increase',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/Cart/increase-product-in-cart?id=${id}`)
      dispatch(fetchCart())
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to increase quantity')
    }
  }
)

export const reduceCartItem = createAsyncThunk(
  'cart/reduce',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/Cart/reduce-product-in-cart?id=${id}`)
      dispatch(fetchCart())
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to reduce quantity')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/Cart/delete-product-from-cart?id=${id}`)
      dispatch(fetchCart())
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.delete('/Cart/clear-cart')
      dispatch(fetchCart())
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to clear cart')
    }
  }
)
