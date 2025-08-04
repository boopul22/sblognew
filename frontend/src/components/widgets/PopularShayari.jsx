import { memo } from 'react'

const PopularShayari = memo(() => {
  // Sample popular shayari data - in a real app, this would come from an API
  const popularShayari = [
    {
      id: 1,
      title: "दिल की आवाज़",
      author: "राहुल शर्मा",
      likes: 456
    },
    {
      id: 2,
      title: "मोहब्बत का एहसास",
      author: "प्रिया गुप्ता",
      likes: 389
    },
    {
      id: 3,
      title: "जिंदगी के रंग",
      author: "अमित कुमार",
      likes: 298
    }
  ]

  return (
    <div className="widget">
      <h4 className="widget-title">Popular शायरी</h4>
      <div className="popular-list">
        {popularShayari.map((item) => (
          <div key={item.id} className="popular-item">
            <h5>{item.title}</h5>
            <p className="popular-author">{item.author}</p>
            <span className="popular-likes">{item.likes} ❤️</span>
          </div>
        ))}
      </div>
    </div>
  )
})

PopularShayari.displayName = 'PopularShayari'

export default PopularShayari
