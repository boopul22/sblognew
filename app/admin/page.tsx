"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  role: string
  display_name: string | null
  email?: string | null
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [sessionPresent, setSessionPresent] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [counts, setCounts] = useState<{ posts?: number | null; categories?: number | null; tags?: number | null }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        setLoading(true)
        setError(null)

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        const session = sessionData?.session || null
        setSessionPresent(!!session)

        if (!session) {
          setLoading(false)
          return
        }

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        const user = userData?.user
        if (!user) {
          setLoading(false)
          return
        }

        // Load profile and role
        const { data: profileRows, error: profileError, count: _pc } = await supabase
          .from('users')
          .select('id, role, display_name, email')
          .eq('id', user.id)
          .limit(1)

        if (profileError) throw profileError
        const prof = profileRows?.[0] as UserProfile | undefined

        const isUserAdmin = prof?.role === 'admin'
        setIsAdmin(!!isUserAdmin)
        setProfile(prof || null)

        if (!isUserAdmin) {
          setLoading(false)
          return
        }

        // Load some basic counts (RLS may restrict these; handle gracefully)
        const postsQ = supabase.from('posts').select('*', { count: 'exact', head: true })
        const catsQ = supabase.from('categories').select('*', { count: 'exact', head: true })
        const tagsQ = supabase.from('tags').select('*', { count: 'exact', head: true })

        const [postsRes, catsRes, tagsRes] = await Promise.allSettled([postsQ, catsQ, tagsQ])

        const postsCount = postsRes.status === 'fulfilled' ? postsRes.value.count ?? null : null
        const catsCount = catsRes.status === 'fulfilled' ? catsRes.value.count ?? null : null
        const tagsCount = tagsRes.status === 'fulfilled' ? tagsRes.value.count ?? null : null

        if (!cancelled) {
          setCounts({ posts: postsCount, categories: catsCount, tags: tagsCount })
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Unexpected error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-semibold">Loading…</h1>
        <p className="text-secondary-text dark:text-dark-secondary-text mt-2">Checking your session and permissions.</p>
      </div>
    )
  }

  if (sessionPresent === false) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold">Sign in required</h1>
        <p className="text-secondary-text dark:text-dark-secondary-text mt-3">You must be signed in to access the admin dashboard.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/login" className="inline-block bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-md px-5 py-2.5">Login</Link>
          <Link href="/" className="inline-block border border-border dark:border-dark-border rounded-md px-5 py-2.5">Go Home</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold">Not authorized</h1>
        <p className="text-secondary-text dark:text-dark-secondary-text mt-3">Your account does not have access to the admin dashboard.</p>
        <div className="mt-6">
          <Link href="/" className="inline-block bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-md px-5 py-2.5">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-secondary-text dark:text-dark-secondary-text mt-2">Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}.</p>
        </div>
        <Link href="/" className="text-primary dark:text-dark-primary hover:underline">Back to site</Link>
      </div>

      {error && (
        <div className="mt-6 p-4 border border-red-300/50 dark:border-red-700/50 bg-red-50/50 dark:bg-red-950/30 rounded-md text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="rounded-lg p-5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
          <div className="text-sm text-secondary-text dark:text-dark-secondary-text">Posts</div>
          <div className="mt-1 text-3xl font-semibold">{counts.posts ?? '—'}</div>
        </div>
        <div className="rounded-lg p-5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
          <div className="text-sm text-secondary-text dark:text-dark-secondary-text">Categories</div>
          <div className="mt-1 text-3xl font-semibold">{counts.categories ?? '—'}</div>
        </div>
        <div className="rounded-lg p-5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
          <div className="text-sm text-secondary-text dark:text-dark-secondary-text">Tags</div>
          <div className="mt-1 text-3xl font-semibold">{counts.tags ?? '—'}</div>
        </div>
      </div>

      <div className="mt-10 rounded-lg p-5 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border">
        <h2 className="text-xl font-semibold">Tools</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-primary-text dark:text-dark-primary-text">
          <li>
            <a href="/api/debug" className="text-primary dark:text-dark-primary hover:underline">System debug</a>
          </li>
          <li>
            <a href="/api/r2/health" className="text-primary dark:text-dark-primary hover:underline">R2 health</a>
          </li>
          <li>
            <a href="/api/r2/list" className="text-primary dark:text-dark-primary hover:underline">R2 list files</a>
          </li>
        </ul>
        <p className="text-xs text-secondary-text dark:text-dark-secondary-text mt-3">Note: Access to some API tools may require additional server-side auth configuration.</p>
      </div>
    </div>
  )
}

