import type { Post, Category, Shayari } from '../types';
import { supabase } from '../lib/supabase';

const mockShayariCollection: Shayari[] = [
    {
        id: 1,
        theme: "love",
        lines: [
            "तेरी मुस्कान में छुपा है मेरा प्यार",
            "तेरे बिना अधूरा है ये संसार",
            "दिल की हर धड़कन में बसा है तेरा नाम",
            "तू ही मेरी मंजिल, तू ही मेरा आराम"
        ],
        lines_en_hi: [
            "Teri muskaan mein chhupa hai mera pyaar",
            "Tere bina adhoora hai yeh sansaar",
            "Dil ki har dhadkan mein basa hai tera naam",
            "Tu hi meri manzil, tu hi mera aaraam"
        ],
        author: "राहुल शर्मा",
        author_en_hi: "Rahul Sharma",
        likes: 24,
        views: 456,
        shares: 12
    },
    {
        id: 2,
        theme: "sad",
        lines: [
            "टूटे हुए दिल की ये कहानी है",
            "हर आंसू में छुपी पुरानी है",
            "खुशियों का वो जमाना गुजर गया",
            "अब तो बस गम की रवानी है"
        ],
        lines_en_hi: [
            "Toote hue dil ki yeh kahani hai",
            "Har aansu mein chhupi purani hai",
            "Khushiyon ka woh zamana guzar gaya",
            "Ab toh bas gham ki ravaani hai"
        ],
        author: "प्रिया वर्मा",
        author_en_hi: "Priya Verma",
        likes: 18,
        views: 321,
        shares: 8
    },
    {
        id: 3,
        theme: "motivational",
        lines: [
            "हार मानना नहीं है काम हमारा",
            "जीतना है ये इरादा हमारा",
            "मुश्किलों से लड़ना है हमको",
            "यही तो है जमाना हमारा"
        ],
        lines_en_hi: [
            "Haar maanna nahi hai kaam hamara",
            "Jeetna hai yeh iraada hamara",
            "Mushkilon se ladna hai humko",
            "Yahi toh hai zamana hamara"
        ],
        author: "अमित कुमार",
        author_en_hi: "Amit Kumar",
        likes: 35,
        views: 678,
        shares: 19
    },
    {
        id: 4,
        theme: "friendship",
        lines: [
            "दोस्ती का ये रिश्ता निराला है",
            "हर गम में साथ देने वाला है",
            "जिंदगी की हर खुशी में शामिल",
            "ऐसा दोस्त मिलना भी कमाल है"
        ],
        lines_en_hi: [
            "Dosti ka yeh rishta niraala hai",
            "Har gham mein saath dene wala hai",
            "Zindagi ki har khushi mein shaamil",
            "Aisa dost milna bhi kamaal hai"
        ],
        author: "सुनीता गुप्ता",
        author_en_hi: "Sunita Gupta",
        likes: 42,
        views: 543,
        shares: 25
    }
];

const mockPosts: Post[] = [
  {
    id: "shayari-1",
    title: "दिल की बात",
    title_en_hi: "Dil Ki Baat",
    slug: "dil-ki-baat",
    content: "<p>जब से तुम मिले हो, जिंदगी में रंग आ गया है, हर लम्हा खूबसूरत और हर पल खास बन गया है। तुम्हारी आँखों में देखकर, हम खुद को भूल जाते हैं, तुम्हारी बातों में खोकर, एक नई दुनिया में बस जाते हैं।</p>",
    content_en_hi: "<p>Jab se tum mile ho, zindagi mein rang aa gaya hai, har lamha khoobsurat aur har pal khaas ban gaya hai. Tumhari aankhon mein dekhkar, hum khud ko bhool jaate hain, tumhari baaton mein khokar, ek nayi duniya mein bas jaate hain.</p>",
    excerpt: "जब से तुम मिले हो, जिंदगी में रंग आ गया है...",
    excerpt_en_hi: "Jab se tum mile ho, zindagi mein rang aa gaya hai...",
    featured_image_url: "https://picsum.photos/seed/love/1200/800",
    status: 'published',
    author_id: "user1",
    published_at: "2024-07-21T10:00:00Z",
    reading_time: 5,
    view_count: 2450,
    likes: 245,
    users: {
      id: "user1",
      display_name: "राहुल शर्मा",
      display_name_en_hi: "Rahul Sharma",
      username: "rahulsharma",
      avatar_url: "https://i.pravatar.cc/150?u=rahul"
    },
    post_categories: [
      { categories: { id: "cat1", name: "प्रेम शायरी", name_en_hi: "Love Shayari", slug: "prem-shayari", color: "#ec4899" } },
    ],
    post_tags: [
      { tags: { id: "tag1", name: "मोहब्बत", slug: "mohabbat", color: "#ef4444" } },
    ],
    shayariCollection: mockShayariCollection
  },
  {
    id: "shayari-2",
    title: "टूटे सपने",
    title_en_hi: "Toote Sapne",
    slug: "toote-sapne",
    content: "<p>कुछ सपने टूटकर भी खुशियाँ दे जाते हैं, शायद इसीलिए हम उन्हें बार-बार देखते हैं। हर टूटे हुए सपने में एक नई उम्मीद छिपी होती है, जो हमें आगे बढ़ने का हौसला देती है।</p>",
    content_en_hi: "<p>Kuch sapne tootkar bhi khushiyan de jaate hain, shayad isiliye hum unhe baar-baar dekhte hain. Har toote hue sapne mein ek nayi ummeed chhupi hoti hai, jo humein aage badhne ka hausla deti hai.</p>",
    excerpt: "कुछ सपने टूटकर भी खुशियाँ दे जाते हैं...",
    excerpt_en_hi: "Kuch sapne tootkar bhi khushiyan de jaate hain...",
    featured_image_url: "https://picsum.photos/seed/sad/1200/800",
    status: 'published',
    author_id: "user2",
    published_at: "2024-07-20T14:30:00Z",
    reading_time: 1,
    view_count: 1890,
    likes: 189,
    users: {
      id: "user2",
      display_name: "प्रिया गुप्ता",
      display_name_en_hi: "Priya Gupta",
      username: "priyagupta",
      avatar_url: "https://i.pravatar.cc/150?u=priya"
    },
    post_categories: [
      { categories: { id: "cat2", name: "दुख शायरी", name_en_hi: "Sad Shayari", slug: "dukh-shayari", color: "#6366f1" } }
    ],
    post_tags: [
      { tags: { id: "tag2", name: "दर्द", slug: "dard", color: "#3b82f6" } }
    ]
  },
  {
    id: "shayari-3",
    title: "हौसलों का जमाना",
    title_en_hi: "Hauslon Ka Zamana",
    slug: "hauslon-ka-zamana",
    content: "<p>हार कर भी जीतने का जुनून रखना, मुश्किलों में भी मुस्कुराने का हुनर रखना। ये दुनिया तुम्हारे कदमों में होगी, बस अपने हौसलों को हमेशा बुलंद रखना।</p>",
    content_en_hi: "<p>Haar kar bhi jeetne ka junoon rakhna, mushkilon mein bhi muskurane ka hunar rakhna. Yeh duniya tumhare kadmon mein hogi, bas apne hauslon ko hamesha buland rakhna.</p>",
    excerpt: "हार कर भी जीतने का जुनून रखना...",
    excerpt_en_hi: "Haar kar bhi jeetne ka junoon rakhna...",
    featured_image_url: "https://picsum.photos/seed/motivation/1200/800",
    status: 'published',
    author_id: "user3",
    published_at: "2024-07-19T09:00:00Z",
    reading_time: 1,
    view_count: 3560,
    likes: 356,
     users: {
      id: "user3",
      display_name: "अमित कुमार",
      display_name_en_hi: "Amit Kumar",
      username: "amitkumar",
      avatar_url: "https://i.pravatar.cc/150?u=amit"
    },
    post_categories: [
      { categories: { id: "cat3", name: "मोटिवेशनल शायरी", name_en_hi: "Motivational Shayari", slug: "motivational-shayari", color: "#f97316" } },
    ],
    post_tags: [
      { tags: { id: "tag3", name: "हिम्मत", slug: "himmat", color: "#22c55e" } }
    ]
  },
  {
    id: "shayari-4",
    title: "दोस्ती का रिश्ता",
    title_en_hi: "Dosti Ka Rishta",
    slug: "dosti-ka-rishta",
    content: "<p>सच्चे दोस्त वो होते हैं जो मुश्किल वक्त में साथ खड़े रहते हैं। जिनके साथ हँसने-रोने में कोई शर्म नहीं होती, वो रिश्ता दोस्ती का होता है।</p>",
    content_en_hi: "<p>Sacche dost woh hote hain jo mushkil waqt mein saath khade rehte hain. Jinke saath hasne-rone mein koi sharm nahi hoti, woh rishta dosti ka hota hai.</p>",
    excerpt: "सच्चे दोस्त वो होते हैं जो मुश्किल वक्त में साथ...",
    excerpt_en_hi: "Sacche dost woh hote hain jo mushkil waqt mein saath...",
    featured_image_url: "https://picsum.photos/seed/friendship/1200/800",
    status: 'published',
    author_id: "user4",
    published_at: "2024-07-18T11:00:00Z",
    reading_time: 1,
    view_count: 2980,
    likes: 298,
     users: {
      id: "user4",
      display_name: "सुनीता देवी",
      display_name_en_hi: "Sunita Devi",
      username: "sunitadevi",
      avatar_url: "https://i.pravatar.cc/150?u=sunita"
    },
    post_categories: [
      { categories: { id: "cat4", name: "दोस्ती शायरी", name_en_hi: "Friendship Shayari", slug: "dosti-shayari", color: "#10b981" } },
    ],
    post_tags: [
      { tags: { id: "tag4", name: "यारी", slug: "yaari", color: "#06b6d4" } }
    ]
  },
   {
    id: "shayari-5",
    title: "जिंदगी के रंग",
    title_en_hi: "Zindagi Ke Rang",
    slug: "zindagi-ke-rang",
    content: "<p>हर दिन नया होता है, हर पल एक नई शुरुआत। जिंदगी के हर रंग का मजा लो, क्या पता कल हो न हो।</p>",
    content_en_hi: "<p>Har din naya hota hai, har pal ek nayi shuruaat. Zindagi ke har rang ka maza lo, kya pata kal ho na ho.</p>",
    excerpt: "हर दिन नया होता है, हर पल एक नई शुरुआत...",
    excerpt_en_hi: "Har din naya hota hai, har pal ek nayi shuruaat...",
    featured_image_url: "https://picsum.photos/seed/life/1200/800",
    status: 'published',
    author_id: "user5",
    published_at: "2024-07-17T18:00:00Z",
    reading_time: 1,
    view_count: 4120,
    likes: 412,
     users: {
      id: "user5",
      display_name: "विकास पांडे",
      display_name_en_hi: "Vikas Pandey",
      username: "vikaspandey",
      avatar_url: "https://i.pravatar.cc/150?u=vikas"
    },
    post_categories: [
      { categories: { id: "cat5", name: "जिंदगी शायरी", name_en_hi: "Life Shayari", slug: "zindagi-shayari", color: "#8b5cf6" } },
    ],
    post_tags: [
      { tags: { id: "tag5", name: "जीवन", slug: "jeevan", color: "#f59e0b" } }
    ]
  },
  {
    id: "shayari-6",
    title: "प्रेम की गहराई",
    title_en_hi: "Prem Ki Gehrai",
    slug: "prem-ki-gehrai",
    content: "<p>तुम्हारी मोहब्बत में डूबकर हमने जीना सीखा है, हर दर्द को सहकर भी मुस्कुराना सीखा है। तुम्हारे बिना ये दुनिया अधूरी लगती है, तुम्हारे साथ हर पल एक पूरी जिंदगी लगती है।</p>",
    content_en_hi: "<p>Tumhari mohabbat mein doobkar humne jeena seekha hai, har dard ko sehkar bhi muskurana seekha hai. Tumhare bina yeh duniya adhoori lagti hai, tumhare saath har pal ek poori zindagi lagti hai.</p>",
    excerpt: "तुम्हारी मोहब्बत में डूबकर हमने जीना सीखा है...",
    excerpt_en_hi: "Tumhari mohabbat mein doobkar humne jeena seekha hai...",
    featured_image_url: "https://picsum.photos/seed/romance/1200/800",
    status: 'published',
    author_id: "user1",
    published_at: "2024-07-16T12:00:00Z",
    reading_time: 2,
    view_count: 5230,
    likes: 523,
    users: {
      id: "user1",
      display_name: "राहुल शर्मा",
      display_name_en_hi: "Rahul Sharma",
      username: "rahulsharma",
      avatar_url: "https://i.pravatar.cc/150?u=rahul"
    },
    post_categories: [
      { categories: { id: "cat1", name: "प्रेम शायरी", name_en_hi: "Love Shayari", slug: "prem-shayari", color: "#ec4899" } }
    ],
    post_tags: [
      { tags: { id: "tag1", name: "मोहब्बत", slug: "mohabbat", color: "#ef4444" } },
      { tags: { id: "tag6", name: "इश्क", slug: "ishq", color: "#d946ef" } }
    ]
  }
];

// Simulate network delay
const delay = <T,>(data: T, ms: number): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const fetchPosts = async (): Promise<Post[]> => {
  console.log("Fetching all posts from Supabase...");

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          display_name,
          username,
          avatar_url
        ),
        post_categories (
          categories (
            id,
            name,
            slug,
            color
          )
        ),
        post_tags (
          tags (
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    // Transform the data to match frontend expectations
    const transformedPosts: Post[] = (posts || []).map(post => ({
      ...post,
      // Add custom fields for frontend compatibility
      title_en_hi: post.title, // Fallback to title if no translation
      content_en_hi: post.content, // Fallback to content if no translation
      excerpt_en_hi: post.excerpt || '', // Fallback to excerpt if no translation
      featured_image_url: post.featured_image_url || post.featured_image || '',
      likes: 0, // TODO: Calculate from likes table
      users: post.users ? {
        ...post.users,
        display_name_en_hi: post.users.display_name || post.users.username || ''
      } : undefined,
      post_categories: post.post_categories?.map((pc: any) => ({
        categories: {
          ...pc.categories,
          name_en_hi: pc.categories.name // Fallback to name if no translation
        }
      })) || [],
      post_tags: post.post_tags?.map((pt: any) => ({
        tags: {
          ...pt.tags,
          name_en_hi: pt.tags.name // Fallback to name if no translation
        }
      })) || []
    }));

    return transformedPosts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
};

// Parse HTML content to extract individual shayaris with images and all content
const parseShayaris = (htmlContent: string, post: any): Shayari[] => {
  if (!htmlContent) return [];

  const shayaris: Shayari[] = [];
  let shayariIndex = 0;

  // Extract blockquotes using regex
  const blockquoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
  let blockquoteMatch;

  while ((blockquoteMatch = blockquoteRegex.exec(htmlContent)) !== null) {
    const blockquoteContent = blockquoteMatch[1];
    // Remove HTML tags and get text content
    const text = blockquoteContent.replace(/<[^>]*>/g, '').trim();

    if (text) {
      // Clean the text and split by line breaks
      const lines = text.split('\n').filter(line => line.trim()).map(line => line.trim());

      // Determine theme based on content
      const lowerText = text.toLowerCase();
      let theme: 'love' | 'sad' | 'motivational' | 'friendship' | 'life' = 'life';

      if (lowerText.includes('प्यार') || lowerText.includes('मोहब्बत') || lowerText.includes('इश्क') || lowerText.includes('love')) {
        theme = 'love';
      } else if (lowerText.includes('दुख') || lowerText.includes('गम') || lowerText.includes('आंसू') || lowerText.includes('sad')) {
        theme = 'sad';
      } else if (lowerText.includes('हिम्मत') || lowerText.includes('जीत') || lowerText.includes('सफल') || lowerText.includes('motivat')) {
        theme = 'motivational';
      } else if (lowerText.includes('दोस्त') || lowerText.includes('मित्र') || lowerText.includes('friend')) {
        theme = 'friendship';
      }

      // Create individual text-only card for each blockquote
      const newShayari: Shayari = {
        id: ++shayariIndex,
        theme,
        lines,
        lines_en_hi: lines, // For now, use same content for both languages
        author: post?.users?.display_name || post?.users?.username || "अज्ञात",
        author_en_hi: post?.users?.display_name || post?.users?.username || "Unknown",
        likes: Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 500) + 100,
        shares: Math.floor(Math.random() * 20) + 5
      };
      shayaris.push(newShayari);
    }
  }

  // If no blockquotes found, extract paragraphs
  if (shayaris.length === 0) {
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let paragraphMatch;

    while ((paragraphMatch = paragraphRegex.exec(htmlContent)) !== null) {
      const paragraphContent = paragraphMatch[1];
      // Remove HTML tags and get text content, skip if contains images
      if (!paragraphContent.includes('<img')) {
        const text = paragraphContent.replace(/<[^>]*>/g, '').trim();

        if (text && text.length > 10) { // Only include substantial paragraphs
          const paragraphShayari: Shayari = {
            id: ++shayariIndex,
            theme: 'life',
            lines: [text],
            lines_en_hi: [text],
            author: post?.users?.display_name || post?.users?.username || "अज्ञात",
            author_en_hi: post?.users?.display_name || post?.users?.username || "Unknown",
            likes: Math.floor(Math.random() * 25) + 3,
            views: Math.floor(Math.random() * 200) + 30,
            shares: Math.floor(Math.random() * 10) + 1
          };
          shayaris.push(paragraphShayari);
        }
      }
    }
  }

  return shayaris.filter(shayari => shayari.lines.length > 0);
};

export const fetchPostBySlug = async (slug: string): Promise<Post | undefined> => {
  console.log(`Fetching post with slug: ${slug} from Supabase...`);

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          display_name,
          username,
          avatar_url
        ),
        post_categories (
          categories (
            id,
            name,
            slug,
            color
          )
        ),
        post_tags (
          tags (
            id,
            name,
            slug,
            color
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .limit(1);

    if (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }

    if (!posts || posts.length === 0) {
      return undefined;
    }

    const post = posts[0];

    // Transform the data to match frontend expectations
    const transformedPost: Post = {
      ...post,
      // Add custom fields for frontend compatibility
      title_en_hi: post.title, // Fallback to title if no translation
      content_en_hi: post.content, // Fallback to content if no translation
      excerpt_en_hi: post.excerpt || '', // Fallback to excerpt if no translation
      featured_image_url: post.featured_image_url || post.featured_image || '',
      likes: 0, // TODO: Calculate from likes table
      users: post.users ? {
        ...post.users,
        display_name_en_hi: post.users.display_name || post.users.username || ''
      } : undefined,
      post_categories: post.post_categories?.map((pc: any) => ({
        categories: {
          ...pc.categories,
          name_en_hi: pc.categories.name // Fallback to name if no translation
        }
      })) || [],
      post_tags: post.post_tags?.map((pt: any) => ({
        tags: {
          ...pt.tags,
          name_en_hi: pt.tags.name // Fallback to name if no translation
        }
      })) || [],
      shayariCollection: parseShayaris(post.content || '', post) // Parse real content instead of mock data
    };

    return transformedPost;
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return undefined;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  console.log("Fetching categories from Supabase...");

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    // Transform the data to match frontend expectations
    const transformedCategories: Category[] = (categories || []).map(category => ({
      ...category,
      name_en_hi: category.name // Fallback to name if no translation
    }));

    return transformedCategories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
}