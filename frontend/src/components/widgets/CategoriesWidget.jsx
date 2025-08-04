import { memo, useState } from 'react'
import { Link } from 'react-router-dom'

// Categories matching the wireframe design
const categories = [
  'प्रेम शायरी',
  'दुख शायरी',
  'मोटिवेशनल शायरी',
  'दोस्ती शायरी',
  'जिंदगी शायरी',
  'रोमांटिक शायरी'
]

const CategoriesWidget = memo(({ onCategoryChange, selectedCategory = 'all' }) => {
  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    if (onCategoryChange) {
      onCategoryChange(category)
    } else {
      // Fallback alert for demo
      alert(`${category} फ़िल्टर लागू किया गया!`)
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
        {categories.map((category) => (
          <a
            key={category}
            href="#"
            className={`category-link ${selectedCategory === category ? 'active' : ''}`}
            onClick={(e) => handleCategoryClick(e, category)}
          >
            {category}
          </a>
        ))}
      </div>
    </div>
  )
})

CategoriesWidget.displayName = 'CategoriesWidget'

export default CategoriesWidget
