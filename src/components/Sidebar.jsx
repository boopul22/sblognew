import { memo } from 'react'
import PopularShayari from './widgets/PopularShayari'
import CategoriesWidget from './widgets/CategoriesWidget'
import RecentPosts from './widgets/RecentPosts'
import AuthorSpotlight from './widgets/AuthorSpotlight'
import NewsletterSignup from './widgets/NewsletterSignup'

const Sidebar = memo(({ selectedCategory, onCategoryChange }) => {
  return (
    <aside className="sidebar">
      <PopularShayari />
      <CategoriesWidget 
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      <RecentPosts />
      <AuthorSpotlight />
      <NewsletterSignup />
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
