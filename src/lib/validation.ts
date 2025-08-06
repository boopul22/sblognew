import { z } from 'zod'

// Common validation patterns
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const usernamePattern = /^[a-zA-Z0-9_-]+$/
const phonePattern = /^\+?[1-9]\d{1,14}$/

// Base schemas
export const idSchema = z.number().int().positive()
export const slugSchema = z.string().min(1).max(100).regex(slugPattern, 'Invalid slug format')
export const emailSchema = z.string().email('Invalid email address')
export const urlSchema = z.string().url('Invalid URL')
export const phoneSchema = z.string().regex(phonePattern, 'Invalid phone number')

// User validation schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(usernamePattern, 'Username can only contain letters, numbers, underscores, and hyphens')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: nameSchema,
  username: usernameSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.string().min(1, 'Reset token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Post validation schemas
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: slugSchema,
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  featured_image: urlSchema.optional(),
  published: z.boolean().default(false),
  author_id: idSchema,
  category_ids: z.array(idSchema).optional(),
  tag_ids: z.array(idSchema).optional(),
})

export const createPostSchema = postSchema.omit({ slug: true })
export const updatePostSchema = postSchema.partial().extend({
  id: idSchema,
})

// Author validation schemas
export const authorSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  avatar: urlSchema.optional(),
  website: urlSchema.optional(),
  social_links: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
})

export const createAuthorSchema = authorSchema
export const updateAuthorSchema = authorSchema.partial().extend({
  id: idSchema,
})

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: slugSchema,
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  parent_id: idSchema.optional(),
})

export const createCategorySchema = categorySchema.omit({ slug: true })
export const updateCategorySchema = categorySchema.partial().extend({
  id: idSchema,
})

// Tag validation schemas
export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  slug: slugSchema,
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
})

export const createTagSchema = tagSchema.omit({ slug: true })
export const updateTagSchema = tagSchema.partial().extend({
  id: idSchema,
})

// Comment validation schemas
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
  author_name: nameSchema,
  author_email: emailSchema,
  author_website: urlSchema.optional(),
  post_id: idSchema,
  parent_id: idSchema.optional(),
})

// Contact form validation
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
})

// Newsletter subscription
export const newsletterSchema = z.object({
  email: emailSchema,
  name: nameSchema.optional(),
})

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query must be less than 100 characters'),
  category: slugSchema.optional(),
  tag: slugSchema.optional(),
  author: usernameSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
}).refine((data) => data.file.size <= data.maxSize, {
  message: 'File size exceeds maximum allowed size',
}).refine((data) => data.allowedTypes.includes(data.file.type), {
  message: 'File type not allowed',
})

// Utility functions for validation
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

export function safeValidateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodError
} {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

// Sanitization functions
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .substring(0, 1000) // Limit length
}

// Type exports
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type PostData = z.infer<typeof postSchema>
export type AuthorData = z.infer<typeof authorSchema>
export type CategoryData = z.infer<typeof categorySchema>
export type TagData = z.infer<typeof tagSchema>
export type CommentData = z.infer<typeof commentSchema>
export type ContactData = z.infer<typeof contactSchema>
export type SearchData = z.infer<typeof searchSchema>
