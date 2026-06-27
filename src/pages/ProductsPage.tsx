import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchProducts } from '@/features/products/productThunks'
import { fetchCategories } from '@/features/categories/categoryThunks'
import { fetchBrands } from '@/features/brands/brandThunks'
import { fetchColors } from '@/features/colors/colorThunks'
import ProductCard from '@/components/common/ProductCard'
import Loader from '@/components/common/Loader'

const PAGE_SIZE = 9

const CONDITION_OPTIONS = ['Any', 'Refurbished', 'Brand new', 'Old items']
const FEATURE_OPTIONS = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory']

function FilterSection({ title, children, defaultOpen = true }: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-200 dark:border-[#1a1a1a] pb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-base font-medium text-black dark:text-gray-200 mb-4"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  )
}

const ProductsPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const { products, loading, pagination } = useAppSelector((s) => s.products)
  const { categories } = useAppSelector((s) => s.categories)
  const { items: brands } = useAppSelector((s) => s.brands)
  const { items: colors } = useAppSelector((s) => s.colors)

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [condition, setCondition] = useState('Any')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  const subCategoryId = searchParams.get('subCategoryId') ? Number(searchParams.get('subCategoryId')) : undefined
  const productName = searchParams.get('search') || undefined
  const page = Number(searchParams.get('page') || 1)
  const urlMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const urlMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
    dispatch(fetchColors())
  }, [dispatch])

  const doFetch = useCallback(() => {
    dispatch(fetchProducts({
      categoryId,
      subCategoryId,
      productName,
      brandId: selectedBrands.length === 1 ? selectedBrands[0] : undefined,
      colorId: selectedColorId ?? undefined,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    }))
  }, [dispatch, categoryId, subCategoryId, productName, selectedBrands, selectedColorId, urlMinPrice, urlMaxPrice, page])

  // Single effect — fires whenever any filter dependency changes
  useEffect(() => {
    doFetch()
  }, [doFetch])

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams)
    if (minPrice) p.set('minPrice', minPrice); else p.delete('minPrice')
    if (maxPrice) p.set('maxPrice', maxPrice); else p.delete('maxPrice')
    p.set('page', '1')
    setSearchParams(p)
  }

  const setCategory = (id: number | undefined) => {
    const p = new URLSearchParams()
    if (id) p.set('categoryId', String(id))
    p.delete('subCategoryId')
    p.set('page', '1')
    setSearchParams(p)
  }

  const setSubCategory = (id: number | undefined) => {
    const p = new URLSearchParams(searchParams)
    if (id) p.set('subCategoryId', String(id))
    else p.delete('subCategoryId')
    p.set('page', '1')
    setSearchParams(p)
  }

  const toggleBrand = (id: number) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )

  const totalPages = Math.ceil((pagination.totalCount || products.length) / PAGE_SIZE)

  // Find the currently selected category to show its subcategories
  const selectedCategory = categoryId ? categories.find((c) => c.id === categoryId) : undefined
  const subCategories = selectedCategory?.subCategories ?? []

  const FilterSidebar = () => (
    <div className="w-full space-y-6">
      {/* Category */}
      <FilterSection title={t('filters.category')}>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setCategory(undefined)}
              className={`w-full text-left text-sm transition-colors ${
                !categoryId ? 'text-[#E11D48] font-medium' : 'text-gray-500 hover:text-black dark:text-gray-200'
              }`}
            >
              {t('filters.all_products')}
            </button>
          </li>
          {categories.slice(0, 8).map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setCategory(c.id)}
                className={`w-full text-left text-sm transition-colors ${
                  categoryId === c.id ? 'text-[#E11D48] font-medium' : 'text-gray-500 hover:text-black dark:text-gray-200'
                }`}
              >
                {c.categoryName}
              </button>
            </li>
          ))}
          {categories.length > 8 && (
            <li>
              <button className="text-sm text-black dark:text-gray-200 underline underline-offset-2 hover:text-[#E11D48]">
                {t('filters.see_all')}
              </button>
            </li>
          )}
        </ul>
      </FilterSection>

      {/* Subcategories — shown only when a category with subs is selected */}
      {subCategories.length > 0 && (
        <FilterSection title={t('filters.subcategory')}>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setSubCategory(undefined)}
                className={`w-full text-left text-sm transition-colors ${
                  !subCategoryId ? 'text-[#E11D48] font-medium' : 'text-gray-500 hover:text-black dark:text-gray-200'
                }`}
              >
                {t('filters.all')}
              </button>
            </li>
            {subCategories.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setSubCategory(s.id)}
                  className={`w-full text-left text-sm transition-colors ${
                    subCategoryId === s.id ? 'text-[#E11D48] font-medium' : 'text-gray-500 hover:text-black dark:text-gray-200'
                  }`}
                >
                  {s.subCategoryName}
                </button>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <FilterSection title={t('filters.brands')}>
          <ul className="space-y-3">
            {brands.slice(0, 6).map((b) => (
              <li key={b.id}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.id)}
                    onChange={() => toggleBrand(b.id)}
                    className="accent-[#E11D48] w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-black dark:text-gray-200 transition-colors">
                    {b.brandName}
                  </span>
                </label>
              </li>
            ))}
            {brands.length > 6 && (
              <li>
                <button className="text-sm text-black dark:text-gray-200 underline underline-offset-2 hover:text-[#E11D48]">
                  {t('filters.see_all')}
                </button>
              </li>
            )}
          </ul>
        </FilterSection>
      )}

      {/* Features */}
      <FilterSection title={t('filters.features')} defaultOpen={false}>
        <ul className="space-y-3">
          {FEATURE_OPTIONS.map((f) => (
            <li key={f}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="accent-[#E11D48] w-4 h-4 rounded" />
                <span className="text-sm text-gray-600 group-hover:text-black dark:text-gray-200 transition-colors">{f}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price range */}
      <FilterSection title={t('filters.price_range')}>
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">{t('filters.min_price')}</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-3 py-2 text-sm text-black dark:text-gray-200 outline-none focus:border-[#E11D48]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">{t('filters.max_price')}</label>
              <input
                type="number"
                placeholder="999999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#1a1a1a] rounded px-3 py-2 text-sm text-black dark:text-gray-200 outline-none focus:border-[#E11D48]"
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full border border-[#E11D48] text-[#E11D48] py-2 rounded text-sm font-medium hover:bg-[#E11D48] hover:text-white transition-colors"
          >
            {t('filters.apply')}
          </button>
        </div>
      </FilterSection>

      {/* Condition */}
      <FilterSection title={t('filters.condition')} defaultOpen={false}>
        <ul className="space-y-3">
          {CONDITION_OPTIONS.map((opt) => (
            <li key={opt}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="condition"
                  value={opt}
                  checked={condition === opt}
                  onChange={() => setCondition(opt)}
                  className="accent-[#E11D48] w-4 h-4"
                />
                <span className="text-sm text-gray-600 group-hover:text-black dark:text-gray-200 transition-colors">{opt}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Ratings */}
      <FilterSection title={t('filters.ratings')} defaultOpen={false}>
        <ul className="space-y-3">
          {[5, 4, 3, 2].map((stars) => (
            <li key={stars}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="accent-[#E11D48] w-4 h-4 rounded" />
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill={i <= stars ? '#FFAD33' : '#e5e7eb'}
                        stroke={i <= stars ? '#FFAD33' : '#e5e7eb'}
                        strokeWidth="1"
                      />
                    </svg>
                  ))}
                </div>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Colors */}
      {colors.length > 0 && (
        <FilterSection title={t('filters.colors')} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedColorId(selectedColorId === c.id ? null : c.id)}
                title={c.colorName}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selectedColorId === c.id
                    ? 'border-black ring-2 ring-black ring-offset-1'
                    : 'border-transparent hover:border-gray-400'
                }`}
                style={{ backgroundColor: c.hexCode }}
              />
            ))}
          </div>
          {selectedColorId && (
            <button
              onClick={() => setSelectedColorId(null)}
              className="mt-3 text-xs text-[#E11D48] hover:underline"
            >
              {t('filters.clear_color')}
            </button>
          )}
        </FilterSection>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
      {/* Breadcrumb + sort */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-black dark:text-gray-200 transition-colors">{t('nav.home')}</Link>
          <span>/</span>
          {selectedCategory ? (
            <>
              <button onClick={() => setCategory(undefined)} className="hover:text-black dark:text-gray-200 transition-colors">
                {t('home.explore')}
              </button>
              <span>/</span>
              <span className="text-black dark:text-gray-200 font-medium">{selectedCategory.categoryName}</span>
              {subCategoryId && subCategories.length > 0 && (
                <>
                  <span>/</span>
                  <span className="text-black dark:text-gray-200 font-medium">
                    {subCategories.find((s) => s.id === subCategoryId)?.subCategoryName}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-black dark:text-gray-200 font-medium">{t('home.explore')}</span>
          )}
        </p>

        <select className="border border-gray-300 dark:border-[#1a1a1a] rounded px-3 py-2 text-sm text-black dark:text-gray-200 bg-white dark:bg-[#0d0d0d] outline-none focus:border-[#E11D48] cursor-pointer">
          <option>{t('filters.sort_popularity')}</option>
          <option>{t('filters.sort_newest')}</option>
          <option>{t('filters.sort_price_low')}</option>
          <option>{t('filters.sort_price_high')}</option>
        </select>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden flex items-center gap-2 mb-6 border border-gray-300 dark:border-[#1a1a1a] rounded px-4 py-2 text-sm text-black dark:text-gray-200 hover:border-[#E11D48] transition-colors"
      >
        <SlidersHorizontal size={16} />
        {mobileFiltersOpen ? t('filters.hide_filters') : t('filters.show_filters')}
      </button>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className={`w-full lg:w-[220px] shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 border border-dashed border-gray-300 dark:border-[#1a1a1a] rounded">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl font-medium text-black dark:text-gray-200">{t('filters.no_products')}</p>
              <p className="text-sm mt-2">{t('filters.no_products_desc')}</p>
            </div>
          ) : (
            <>
              {productName && (
                <p className="mb-4 text-sm text-gray-500">
                  {t('filters.results_for')} <span className="text-black dark:text-gray-200 font-semibold">"{productName}"</span>
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* More Products */}
              {totalPages > 1 && page < totalPages && (
                <div className="flex justify-center mt-16">
                  <button
                    onClick={() => setSearchParams((prev) => {
                      const p = new URLSearchParams(prev)
                      p.set('page', String(page + 1))
                      return p
                    })}
                    className="px-12 py-4 bg-[#E11D48] text-white font-medium rounded hover:bg-[#BE123C] transition-colors text-sm"
                  >
                    {t('filters.more_products')}
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setSearchParams((prev) => {
                        const p = new URLSearchParams(prev)
                        p.set('page', String(n))
                        return p
                      })}
                      className={`w-10 h-10 rounded text-sm transition-colors ${
                        n === page
                          ? 'bg-[#E11D48] text-white font-semibold'
                          : 'bg-[#F5F5F5] dark:bg-[#1a1a1a] text-black dark:text-gray-200 hover:bg-[#E11D48] hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
