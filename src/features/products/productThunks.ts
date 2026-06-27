import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/services/api'
import type {
  Product,
  ApiResponse,
  ProductFilters,
  ProductsListApiResponse,
  RawProductDetail,
} from '@/types'

export interface ProductsResult {
  products: Product[]
  totalRecord: number
  totalPage: number
  pageNumber: number
  pageSize: number
}

export const fetchProducts = createAsyncThunk<ProductsResult, ProductFilters>(
  'products/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (filters.productName)               params.append('ProductName',    filters.productName)
      if (filters.minPrice  !== undefined)   params.append('MinPrice',       String(filters.minPrice))
      if (filters.maxPrice  !== undefined)   params.append('MaxPrice',       String(filters.maxPrice))
      if (filters.brandId   !== undefined)   params.append('BrandId',        String(filters.brandId))
      if (filters.colorId   !== undefined)   params.append('ColorId',        String(filters.colorId))
      if (filters.categoryId   !== undefined) params.append('CategoryId',    String(filters.categoryId))
      if (filters.subCategoryId !== undefined) params.append('SubcategoryId', String(filters.subCategoryId))
      if (filters.pageNumber !== undefined)  params.append('PageNumber',     String(filters.pageNumber))
      if (filters.pageSize   !== undefined)  params.append('PageSize',       String(filters.pageSize))

      const { data } = await api.get<ProductsListApiResponse>(`/Product/get-products?${params}`)

      // Normalize each list item: flat `image` string → `images: [{id, imageUrl}]`
      const products: Product[] = (data.data?.products ?? []).map((raw) => ({
        id: raw.id,
        productName: raw.productName,
        description: '',
        price: raw.price,
        discountPrice: raw.discountPrice,
        hasDiscount: raw.hasDiscount,
        quantity: raw.quantity,
        categoryId: raw.categoryId,
        categoryName: raw.categoryName,
        color: raw.color,
        images: raw.image ? [{ id: 0, imageUrl: raw.image }] : [],
        productInMyCart: raw.productInMyCart,
      }))

      return {
        products,
        totalRecord: data.totalRecord ?? products.length,
        totalPage: data.totalPage ?? 1,
        pageNumber: data.pageNumber ?? 1,
        pageSize: data.pageSize ?? 12,
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk<Product, number>(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ApiResponse<RawProductDetail>>(`/Product/get-product-by-id?id=${id}`)
      const raw = data.data

      // Normalize: images[].images → images[].imageUrl
      const product: Product = {
        id: raw.id,
        productName: raw.productName,
        description: raw.description,
        price: raw.price,
        discountPrice: raw.discountPrice,
        hasDiscount: raw.hasDiscount,
        quantity: raw.quantity,
        subCategoryId: raw.subCategoryId,
        color: raw.color,
        brand: raw.brand,
        code: raw.code,
        weight: raw.weight,
        size: raw.size,
        images: (raw.images ?? []).map((img) => ({ id: img.id, imageUrl: img.images })),
        productInMyCart: raw.productInMyCart,
      }

      return product
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch product')
    }
  }
)
