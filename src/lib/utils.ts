import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3C/svg%3E"

export const imgFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = PLACEHOLDER_SVG
}

export function resolveImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return PLACEHOLDER_SVG
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl
  const base = (import.meta.env.VITE_IMAGE_URL as string || 'https://store-api.softclub.tj/images').replace(/\/$/, '')
  return `${base}/${imageUrl.replace(/^\//, '')}`
}
