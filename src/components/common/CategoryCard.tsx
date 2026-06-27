import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { resolveImageUrl } from '@/lib/utils'

/* Fallback SVG icons per keyword in category name */
const ICON_MAP: { key: string; svg: string }[] = [
  { key: 'phone',       svg: 'M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5S11.17 17 12 17s1.5.67 1.5 1.5S12.83 20 12 20z' },
  { key: 'computer',    svg: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z' },
  { key: 'watch',       svg: 'M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z' },
  { key: 'car',         svg: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5zm-8-3.5c0 .83-.67 1.5-1.5 1.5S8 14.33 8 13.5 8.67 12 9.5 12s1.5.67 1.5 1.5zm7 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z' },
  { key: 'game',        svg: 'M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zm1 6.5V21h6v-5.5l-3-3-3 3zm7.5-6.5l-3 3 3 3H21V9h-5.5z' },
  { key: 'fashion',     svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z' },
  { key: 'cloth',       svg: 'M16 2l4 4-6.75 6.75c.47.89.75 1.9.75 2.97C14 19.1 11.1 22 7.5 22S1 19.1 1 15.72C1 12.34 3.9 9.44 7.28 9.44c1.07 0 2.08.28 2.97.75L12 8.5V6h2V4h2V2zm-8.5 9.94c-2.07 0-3.78 1.71-3.78 3.78s1.71 3.78 3.78 3.78 3.78-1.71 3.78-3.78-1.71-3.78-3.78-3.78z' },
  { key: 'sport',       svg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z' },
  { key: 'medicine',    svg: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z' },
  { key: 'electro',     svg: 'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z' },
  { key: 'home',        svg: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { key: 'book',        svg: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z' },
  { key: 'toy',         svg: 'M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79 2.73 2.71 7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58 3.51-3.47 9.14-3.47 12.65 0L21 3v7.12z' },
]

function getFallbackIcon(name: string) {
  const lower = name.toLowerCase()
  const found = ICON_MAP.find((m) => lower.includes(m.key))
  const path = found?.svg ?? 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
      <path d={path} />
    </svg>
  )
}

interface Props {
  category: Category
  active?: boolean
}

const CategoryCard = ({ category, active = false }: Props) => {
  const [imgError, setImgError] = useState(false)
  const rawImage = category.categoryImage || category.imageUrl
  const imageUrl = rawImage ? resolveImageUrl(rawImage) : null

  const showIcon = !imageUrl || imgError

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.naturalWidth < 10 || img.naturalHeight < 10) { setImgError(true); return }
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = 8; canvas.height = 8
      ctx.drawImage(img, 0, 0, 8, 8)
      const data = ctx.getImageData(0, 0, 8, 8).data
      let bright = 0, count = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 10) continue
        bright += (data[i] + data[i + 1] + data[i + 2]) / 3
        count++
      }
      if (count === 0 || bright / count > 235) setImgError(true)
    } catch { /* CORS — keep image */ }
  }

  return (
    <Link to={`/products?categoryId=${category.id}`}>
      <div
        className={`flex flex-col items-center justify-center gap-3 w-full h-[145px] border rounded-lg cursor-pointer transition-all duration-200 group ${
          active
            ? 'bg-[#E11D48] text-white border-[#E11D48]'
            : 'bg-transparent text-foreground border-gray-200 dark:border-[#2f2f2f] hover:bg-[#E11D48] hover:text-white hover:border-[#E11D48] dark:hover:border-[#E11D48]'
        }`}
      >
        <div className="w-14 h-14 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          {showIcon ? (
            /* SVG icon fallback — stays visible, changes color via currentColor */
            <span className={active ? 'text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-white'}>
              {getFallbackIcon(category.categoryName)}
            </span>
          ) : (
            <img
              src={imageUrl!}
              alt={category.categoryName}
              onError={() => setImgError(true)}
              onLoad={handleImgLoad}
              className={`w-full h-full object-contain transition-all duration-200 ${
                active
                  ? 'brightness-0 invert'
                  : 'dark:brightness-0 dark:invert group-hover:brightness-0 group-hover:invert'
              }`}
            />
          )}
        </div>

        <p className="text-sm font-medium font-poppins text-center leading-tight px-2">
          {category.categoryName}
        </p>
      </div>
    </Link>
  )
}

export default CategoryCard
