import { memo } from 'react'
import PopularShayari from '../../../features/widgets/PopularShayari'
import CategoriesWidget from '../../../features/widgets/CategoriesWidget'
import RecentPosts from '../../../features/widgets/RecentPosts'
import AuthorSpotlight from '../../../features/widgets/AuthorSpotlight'
import NewsletterSignup from '../../../features/widgets/NewsletterSignup'

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
