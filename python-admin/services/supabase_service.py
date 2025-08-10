"""
Supabase database service for the blog admin desktop application.
Handles all database operations including posts, categories, tags, and users.
"""

import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any, Tuple
from supabase import create_client, Client
from slugify import slugify

from config.env_loader import config
from models.post import Post, User
from models.category import Category
from models.tag import Tag


class SupabaseService:
    """Service class for Supabase database operations."""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self.current_user: Optional[User] = None
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize Supabase client."""
        try:
            supabase_config = config.get_supabase_config()
            if not supabase_config['url'] or not supabase_config['anon_key']:
                raise ValueError("Supabase configuration is missing")
            
            self.client = create_client(
                supabase_config['url'],
                supabase_config['anon_key']
            )
            print("✅ Supabase client initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize Supabase client: {e}")
            raise
    
    # Authentication Methods
    
    async def sign_in(self, email: str, password: str) -> Tuple[bool, str]:
        """Sign in user with email and password."""
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user:
                # Load user profile
                user_data = self.client.table('users').select('*').eq('id', response.user.id).execute()
                if user_data.data:
                    self.current_user = User.from_dict(user_data.data[0])
                    return True, "Login successful"
                else:
                    return False, "User profile not found"
            else:
                return False, "Invalid credentials"
        except Exception as e:
            return False, f"Login failed: {str(e)}"
    
    def sign_out(self) -> None:
        """Sign out current user."""
        try:
            self.client.auth.sign_out()
            self.current_user = None
        except Exception as e:
            print(f"Sign out error: {e}")
    
    def get_current_user(self) -> Optional[User]:
        """Get current authenticated user."""
        return self.current_user
    
    def is_authenticated(self) -> bool:
        """Check if user is authenticated."""
        return self.current_user is not None
    
    def has_admin_access(self) -> bool:
        """Check if current user has admin access."""
        return (self.current_user and 
                self.current_user.role in ['admin', 'editor'])
    
    # Post Methods
    
    def get_posts(self, limit: int = 50, offset: int = 0,
                  status: Optional[str] = None, search: Optional[str] = None) -> List[Post]:
        """Get posts with optional filtering."""
        try:
            # First, try the complex query with joins
            try:
                query = self.client.table('posts').select('''
                    *,
                    users!posts_author_id_fkey (
                        id, display_name, username, avatar_url, role
                    ),
                    post_categories (
                        categories (
                            id, name, slug, color
                        )
                    ),
                    post_tags (
                        tags (
                            id, name, slug, color
                        )
                    )
                ''').order('updated_at', desc=True)

                if status:
                    query = query.eq('status', status)

                if search:
                    query = query.ilike('title', f'%{search}%')

                query = query.range(offset, offset + limit - 1)

                response = query.execute()
                return [Post.from_dict(post_data) for post_data in response.data]

            except Exception as join_error:
                print(f"Complex query failed, trying simple query: {join_error}")

                # Fallback to simple query without joins
                query = self.client.table('posts').select('*').order('updated_at', desc=True)

                if status:
                    query = query.eq('status', status)

                if search:
                    query = query.ilike('title', f'%{search}%')

                query = query.range(offset, offset + limit - 1)

                response = query.execute()
                posts = [Post.from_dict(post_data) for post_data in response.data]

                # Manually load related data for each post
                for post in posts:
                    self._load_post_relations(post)

                return posts

        except Exception as e:
            print(f"Error fetching posts: {e}")
            return []

    def get_posts_count(self, status: Optional[str] = None, search: Optional[str] = None) -> int:
        """Get total count of posts with optional filtering."""
        try:
            query = self.client.table('posts').select('id', count='exact')

            if status:
                query = query.eq('status', status)

            if search:
                query = query.ilike('title', f'%{search}%')

            response = query.execute()
            return response.count or 0
        except Exception as e:
            print(f"Error fetching posts count: {e}")
            return 0

    def get_post_by_id(self, post_id: str) -> Optional[Post]:
        """Get a single post by ID."""
        try:
            response = self.client.table('posts').select('''
                *,
                users (
                    id, display_name, username, avatar_url, role
                ),
                post_categories (
                    categories (
                        id, name, slug, color
                    )
                ),
                post_tags (
                    tags (
                        id, name, slug, color
                    )
                )
            ''').eq('id', post_id).execute()
            
            if response.data:
                return Post.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error fetching post: {e}")
            return None
    
    def create_post(self, post: Post) -> Optional[Post]:
        """Create a new post."""
        try:
            # Ensure slug is unique
            post.slug = self._ensure_unique_slug(post.slug or slugify(post.title))
            post.author_id = self.current_user.id if self.current_user else None
            post.created_at = datetime.now()
            post.updated_at = datetime.now()
            
            # Prepare data for insertion
            post_data = {
                'title': post.title,
                'slug': post.slug,
                'content': post.content,
                'excerpt': post.excerpt,
                'featured_image': post.featured_image,
                'featured_image_url': post.featured_image_url,
                'status': post.status,
                'author_id': post.author_id,
                'category_id': post.category_id,
                'tags': post.tags,
                'meta_title': post.meta_title,
                'meta_description': post.meta_description,
                'reading_time': post.reading_time,
                'view_count': post.view_count,
                'published_at': post.published_at.isoformat() if post.published_at else None,
            }
            
            response = self.client.table('posts').insert(post_data).execute()
            
            if response.data:
                created_post = Post.from_dict(response.data[0])
                
                # Handle category and tag relationships
                if post.category_id:
                    self._update_post_categories(created_post.id, [post.category_id])
                
                if post.post_tags:
                    tag_ids = [tag.id for tag in post.post_tags if tag.id]
                    self._update_post_tags(created_post.id, tag_ids)
                
                return created_post
            return None
        except Exception as e:
            print(f"Error creating post: {e}")
            return None
    
    def update_post(self, post: Post) -> Optional[Post]:
        """Update an existing post."""
        try:
            if not post.id:
                return None
            
            post.updated_at = datetime.now()
            
            # Prepare data for update
            post_data = {
                'title': post.title,
                'slug': post.slug,
                'content': post.content,
                'excerpt': post.excerpt,
                'featured_image': post.featured_image,
                'featured_image_url': post.featured_image_url,
                'status': post.status,
                'category_id': post.category_id,
                'tags': post.tags,
                'meta_title': post.meta_title,
                'meta_description': post.meta_description,
                'reading_time': post.reading_time,
                'published_at': post.published_at.isoformat() if post.published_at else None,
                'updated_at': post.updated_at.isoformat(),
            }
            
            response = self.client.table('posts').update(post_data).eq('id', post.id).execute()
            
            if response.data:
                # Handle category and tag relationships
                if post.category_id:
                    self._update_post_categories(post.id, [post.category_id])
                
                if post.post_tags:
                    tag_ids = [tag.id for tag in post.post_tags if tag.id]
                    self._update_post_tags(post.id, tag_ids)
                
                return Post.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error updating post: {e}")
            return None
    
    def delete_post(self, post_id: str) -> bool:
        """Delete a post."""
        try:
            response = self.client.table('posts').delete().eq('id', post_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error deleting post: {e}")
            return False

    def bulk_update_post_status(self, post_ids: List[str], status: str) -> Tuple[bool, str, int]:
        """
        Bulk update post status for multiple posts.

        Args:
            post_ids: List of post IDs to update
            status: New status ('published', 'draft', 'private')

        Returns:
            Tuple of (success, message, updated_count)
        """
        try:
            if not post_ids:
                return False, "No posts selected", 0

            if status not in ['published', 'draft', 'private']:
                return False, f"Invalid status: {status}", 0

            # Update posts in batches to avoid query limits
            batch_size = 50
            total_updated = 0
            failed_updates = []

            for i in range(0, len(post_ids), batch_size):
                batch_ids = post_ids[i:i + batch_size]

                try:
                    # Update batch
                    update_data = {
                        'status': status,
                        'updated_at': datetime.now().isoformat()
                    }

                    # If changing to published, set published_at if not already set
                    if status == 'published':
                        # First, get posts that don't have published_at set
                        posts_response = self.client.table('posts').select('id, published_at').in_('id', batch_ids).execute()

                        for post_data in posts_response.data:
                            if not post_data.get('published_at'):
                                # Update this specific post with published_at
                                self.client.table('posts').update({
                                    'status': status,
                                    'published_at': datetime.now().isoformat(),
                                    'updated_at': datetime.now().isoformat()
                                }).eq('id', post_data['id']).execute()
                            else:
                                # Just update status for posts that already have published_at
                                self.client.table('posts').update(update_data).eq('id', post_data['id']).execute()
                    else:
                        # For draft/private, just update status
                        response = self.client.table('posts').update(update_data).in_('id', batch_ids).execute()

                    total_updated += len(batch_ids)

                except Exception as batch_error:
                    print(f"Error updating batch {i//batch_size + 1}: {batch_error}")
                    failed_updates.extend(batch_ids)

            success_count = total_updated - len(failed_updates)

            if failed_updates:
                if success_count > 0:
                    return True, f"Updated {success_count} posts successfully, {len(failed_updates)} failed", success_count
                else:
                    return False, f"Failed to update all {len(failed_updates)} posts", 0
            else:
                return True, f"Successfully updated {success_count} posts to {status}", success_count

        except Exception as e:
            print(f"Error in bulk update: {e}")
            return False, f"Bulk update failed: {str(e)}", 0

    def get_posts_by_ids(self, post_ids: List[str]) -> List[Post]:
        """
        Get multiple posts by their IDs.

        Args:
            post_ids: List of post IDs to retrieve

        Returns:
            List of Post objects
        """
        try:
            if not post_ids:
                return []

            # Split into batches to avoid query limits
            batch_size = 50
            all_posts = []

            for i in range(0, len(post_ids), batch_size):
                batch_ids = post_ids[i:i + batch_size]

                try:
                    response = self.client.table('posts').select('''
                        *,
                        users (
                            id, display_name, username, avatar_url, role
                        ),
                        post_categories (
                            categories (
                                id, name, slug, color
                            )
                        ),
                        post_tags (
                            tags (
                                id, name, slug, color
                            )
                        )
                    ''').in_('id', batch_ids).execute()

                    batch_posts = [Post.from_dict(post_data) for post_data in response.data]
                    all_posts.extend(batch_posts)

                except Exception as batch_error:
                    print(f"Error fetching batch {i//batch_size + 1}: {batch_error}")
                    # Try simple query without joins as fallback
                    try:
                        simple_response = self.client.table('posts').select('*').in_('id', batch_ids).execute()
                        batch_posts = [Post.from_dict(post_data) for post_data in simple_response.data]

                        # Load relations manually
                        for post in batch_posts:
                            self._load_post_relations(post)

                        all_posts.extend(batch_posts)
                    except Exception as simple_error:
                        print(f"Simple query also failed for batch {i//batch_size + 1}: {simple_error}")

            return all_posts

        except Exception as e:
            print(f"Error fetching posts by IDs: {e}")
            return []
    
    def _ensure_unique_slug(self, base_slug: str) -> str:
        """Ensure slug is unique by appending number if needed."""
        slug = base_slug
        counter = 1
        
        while True:
            response = self.client.table('posts').select('id').eq('slug', slug).execute()
            if not response.data:
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    def _update_post_categories(self, post_id: str, category_ids: List[str]) -> None:
        """Update post-category relationships."""
        try:
            # Delete existing relationships
            self.client.table('post_categories').delete().eq('post_id', post_id).execute()
            
            # Insert new relationships
            if category_ids:
                relationships = [{'post_id': post_id, 'category_id': cat_id} for cat_id in category_ids]
                self.client.table('post_categories').insert(relationships).execute()
        except Exception as e:
            print(f"Error updating post categories: {e}")
    
    def _update_post_tags(self, post_id: str, tag_ids: List[str]) -> None:
        """Update post-tag relationships."""
        try:
            # Delete existing relationships
            self.client.table('post_tags').delete().eq('post_id', post_id).execute()
            
            # Insert new relationships
            if tag_ids:
                relationships = [{'post_id': post_id, 'tag_id': tag_id} for tag_id in tag_ids]
                self.client.table('post_tags').insert(relationships).execute()
        except Exception as e:
            print(f"Error updating post tags: {e}")

    def _load_post_relations(self, post: Post) -> None:
        """Load related data for a post (author, category, tags)."""
        try:
            # Load author
            if post.author_id:
                try:
                    author_response = self.client.table('users').select('*').eq('id', post.author_id).execute()
                    if author_response.data:
                        from models.post import User
                        post.author = User.from_dict(author_response.data[0])
                except Exception as e:
                    print(f"Error loading author for post {post.id}: {e}")

            # Load category
            if post.category_id:
                try:
                    category_response = self.client.table('categories').select('*').eq('id', post.category_id).execute()
                    if category_response.data:
                        post.category = Category.from_dict(category_response.data[0])
                except Exception as e:
                    print(f"Error loading category for post {post.id}: {e}")

            # Load tags from post_tags relationship
            try:
                tags_response = self.client.table('post_tags').select('''
                    tags (
                        id, name, slug, color
                    )
                ''').eq('post_id', post.id).execute()

                if tags_response.data:
                    post.post_tags = []
                    for tag_data in tags_response.data:
                        if 'tags' in tag_data and tag_data['tags']:
                            post.post_tags.append(Tag.from_dict(tag_data['tags']))
            except Exception as e:
                print(f"Error loading tags for post {post.id}: {e}")

        except Exception as e:
            print(f"Error loading relations for post {post.id}: {e}")

    # Category Methods

    def get_categories(self) -> List[Category]:
        """Get all categories."""
        try:
            response = self.client.table('categories').select('*').order('name').execute()
            return [Category.from_dict(cat_data) for cat_data in response.data]
        except Exception as e:
            print(f"Error fetching categories: {e}")
            return []

    def get_category_by_id(self, category_id: str) -> Optional[Category]:
        """Get a single category by ID."""
        try:
            response = self.client.table('categories').select('*').eq('id', category_id).execute()
            if response.data:
                return Category.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error fetching category: {e}")
            return None

    def create_category(self, category: Category) -> Optional[Category]:
        """Create a new category."""
        try:
            category.slug = self._ensure_unique_category_slug(category.slug or slugify(category.name))
            category.created_at = datetime.now()
            category.updated_at = datetime.now()

            category_data = {
                'name': category.name,
                'slug': category.slug,
                'description': category.description,
                'color': category.color,
                'parent_id': category.parent_id,
            }

            response = self.client.table('categories').insert(category_data).execute()

            if response.data:
                return Category.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error creating category: {e}")
            return None

    def update_category(self, category: Category) -> Optional[Category]:
        """Update an existing category."""
        try:
            if not category.id:
                return None

            category.updated_at = datetime.now()

            category_data = {
                'name': category.name,
                'slug': category.slug,
                'description': category.description,
                'color': category.color,
                'parent_id': category.parent_id,
                'updated_at': category.updated_at.isoformat(),
            }

            response = self.client.table('categories').update(category_data).eq('id', category.id).execute()

            if response.data:
                return Category.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error updating category: {e}")
            return None

    def delete_category(self, category_id: str) -> bool:
        """Delete a category."""
        try:
            response = self.client.table('categories').delete().eq('id', category_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error deleting category: {e}")
            return False

    def _ensure_unique_category_slug(self, base_slug: str) -> str:
        """Ensure category slug is unique."""
        slug = base_slug
        counter = 1

        while True:
            response = self.client.table('categories').select('id').eq('slug', slug).execute()
            if not response.data:
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1

    # Tag Methods

    def get_tags(self) -> List[Tag]:
        """Get all tags."""
        try:
            response = self.client.table('tags').select('*').order('name').execute()
            return [Tag.from_dict(tag_data) for tag_data in response.data]
        except Exception as e:
            print(f"Error fetching tags: {e}")
            return []

    def get_tag_by_id(self, tag_id: str) -> Optional[Tag]:
        """Get a single tag by ID."""
        try:
            response = self.client.table('tags').select('*').eq('id', tag_id).execute()
            if response.data:
                return Tag.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error fetching tag: {e}")
            return None

    def create_tag(self, tag: Tag) -> Optional[Tag]:
        """Create a new tag."""
        try:
            tag.slug = self._ensure_unique_tag_slug(tag.slug or slugify(tag.name))
            tag.created_at = datetime.now()
            tag.updated_at = datetime.now()

            tag_data = {
                'name': tag.name,
                'slug': tag.slug,
                'description': tag.description,
                'color': tag.color,
            }

            response = self.client.table('tags').insert(tag_data).execute()

            if response.data:
                return Tag.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error creating tag: {e}")
            return None

    def update_tag(self, tag: Tag) -> Optional[Tag]:
        """Update an existing tag."""
        try:
            if not tag.id:
                return None

            tag.updated_at = datetime.now()

            tag_data = {
                'name': tag.name,
                'slug': tag.slug,
                'description': tag.description,
                'color': tag.color,
                'updated_at': tag.updated_at.isoformat(),
            }

            response = self.client.table('tags').update(tag_data).eq('id', tag.id).execute()

            if response.data:
                return Tag.from_dict(response.data[0])
            return None
        except Exception as e:
            print(f"Error updating tag: {e}")
            return None

    def delete_tag(self, tag_id: str) -> bool:
        """Delete a tag."""
        try:
            response = self.client.table('tags').delete().eq('id', tag_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error deleting tag: {e}")
            return False

    def _ensure_unique_tag_slug(self, base_slug: str) -> str:
        """Ensure tag slug is unique."""
        slug = base_slug
        counter = 1

        while True:
            response = self.client.table('tags').select('id').eq('slug', slug).execute()
            if not response.data:
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1


# Global service instance
supabase_service = SupabaseService()
