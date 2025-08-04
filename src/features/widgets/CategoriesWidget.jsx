import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCategories } from '../../lib/api/staticData'

const CategoriesWidget = memo(({ onCategoryChange, selectedCategory = 'all' }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleCategoryClick = (e, categorySlug) => {
    e.preventDefault()
    if (onCategoryChange) {
      onCategoryChange(categorySlug)
    } else {
      // Fallback alert for demo
      const category = categories.find(cat => cat.slug === categorySlug)
      alert(`${category?.name || categorySlug} फ़िल्टर लागू किया गया!`)
    }
  }

  return (
    <div className="widget">
      <h4 className="widget-title">श्रेणियाँ</h4>
      <div className="categories-list" id="categoriesList">
        {/* All Categories option */}
        <a
          href="#"
          className={`category-link ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={(e) => handleCategoryClick(e, 'all')}
        >
          सभी श्रेणियाँ
        </a>

        {/* Individual categories */}
        {loading ? (
          <div>Loading categories...</div>
        ) : (
          categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className={`category-link ${selectedCategory === category.slug ? 'active' : ''}`}
              onClick={(e) => handleCategoryClick(e, category.slug)}
            >
              {category.name}
            </a>
          ))
        )}
      </div>
    </div>
  )
})

CategoriesWidget.displayName = 'CategoriesWidget'

export default CategoriesWidget
