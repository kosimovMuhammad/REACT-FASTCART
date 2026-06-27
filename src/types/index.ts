export interface LoginRequest {
  userName: string
  password: string
}

export interface RegisterRequest {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  data: T
  errors: string[]
  statusCode: number
}

export interface ProductImage {
  id: number
  imageUrl: string  // normalized — always use this field in the frontend
}

export interface Color {
  id: number
  colorName: string
  hexCode?: string
}

export interface Brand {
  id: number
  brandName: string
  imageUrl?: string
}

export interface SubCategory {
  id: number
  subCategoryName: string
  imageUrl?: string
}

export interface Category {
  id: number
  categoryName: string
  categoryImage?: string
  imageUrl?: string
  subCategories: SubCategory[]
}

// Raw shape returned by GET /Product/get-products → data.products[]
export interface RawProductListItem {
  id: number
  productName: string
  image: string        // single filename, e.g. "uuid.png"
  color: string        // flat string
  price: number
  discountPrice: number
  hasDiscount: boolean
  quantity: number
  productInMyCart: boolean
  categoryId: number
  categoryName: string
  productInfoFromCart: { id: number; quantity: number } | null
}

// Raw shape returned by GET /Product/get-product-by-id
export interface RawProductDetail {
  id: number
  productName: string
  description: string
  price: number
  discountPrice: number
  hasDiscount: boolean
  quantity: number
  subCategoryId: number
  color: string       // flat string
  brand: string       // flat string
  code: string
  weight: number | null
  size: string | null
  productInMyCart: boolean
  productInfoFromCart: { id: number; quantity: number } | null
  images: { id: number; images: string }[]  // field is "images" not "imageUrl"!
  users: { userId: string; userName: string; fullName: string; imageName: string }[]
}

// Normalized shape used throughout the frontend
export interface Product {
  id: number
  productName: string
  description: string
  price: number
  discountPrice: number
  hasDiscount: boolean
  quantity?: number
  categoryId?: number
  categoryName?: string
  subCategoryId?: number
  color?: string       // flat string
  brand?: string       // flat string
  code?: string
  weight?: number | null
  size?: string | null
  images: ProductImage[]  // always normalized to { id, imageUrl }
  productInMyCart?: boolean
  // kept for wishlist/cart compat
  brandId?: number
  colorId?: number
  colors?: Color[]
}

// Full response from GET /Product/get-products
export interface ProductsListApiResponse {
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRecord: number
  data: {
    products: RawProductListItem[]
    colors: Color[]
    brands: Brand[]
    minMaxPrice: { minPrice: number; maxPrice: number }
  }
  errors: string[]
  statusCode: number
}

// Raw shape returned by GET /Cart/get-products-from-cart
export interface RawCartItemProduct {
  id: number
  productName: string
  price: number
  discountPrice: number
  hasDiscount: boolean
  images: { id: number; imageUrl: string }[]
}

export interface RawCartItem {
  id: number
  productId: number
  quantity: number
  colorId?: number
  colorName?: string
  product: RawCartItemProduct
}

// Normalized shape used in the frontend
export interface CartItem {
  id: number
  productId: number
  productName: string
  price: number
  discountPrice: number
  hasDiscount: boolean
  imageUrl: string
  quantity: number
  colorId: number
  colorName: string
}

export interface UserProfile {
  id: number
  userName: string
  email: string
  phoneNumber: string
  imageUrl: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount?: number
  totalRecord?: number
  totalPage?: number
  pageNumber: number
  pageSize: number
}

export interface ProductFilters {
  categoryId?: number
  subCategoryId?: number
  brandId?: number
  colorId?: number
  minPrice?: number
  maxPrice?: number
  pageNumber?: number
  pageSize?: number
  productName?: string
}
