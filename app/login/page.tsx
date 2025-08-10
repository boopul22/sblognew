"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function checkSession() {
      setLoading(true)
      try {
        const { data } = await supabase.auth.getSession()
        if (!cancelled) setSignedIn(!!data?.session)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    checkSession()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) {
        setError(error.message)
        return
      }
      setMessage('Signed in successfully. Redirecting…')
      // Small delay to ensure session persists
      setTimeout(() => router.replace('/admin'), 400)
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setError(null)
    setMessage(null)
    try {
      await supabase.auth.signOut()
      setSignedIn(false)
      setMessage('Signed out.')
    } catch (err: any) {
      setError(err?.message || 'Sign out failed')
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-semibold">Loading…</h1>
      </div>
    )
  }

  if (signedIn) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold">You are signed in</h1>
        <p className="text-secondary-text dark:text-dark-secondary-text mt-3">Continue to admin dashboard or sign out.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/admin" className="inline-block bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-md px-5 py-2.5">Go to Admin</Link>
          <button onClick={handleSignOut} className="inline-block border border-border dark:border-dark-border px-5 py-2.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10">Sign out</button>
        </div>
        {message && <p className="mt-4 text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="text-secondary-text dark:text-dark-secondary-text mt-2">Use your email and password.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <div className="p-3 rounded-md border border-red-300/50 dark:border-red-700/50 bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="p-3 rounded-md border border-emerald-300/50 dark:border-emerald-700/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm">
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-btn-primary-text dark:bg-dark-primary dark:text-dark-btn-primary-text font-semibold rounded-md py-2.5 disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-sm text-secondary-text dark:text-dark-secondary-text">
        <p>Don’t have access? Contact the site admin.</p>
        <p className="mt-2">Return <Link href="/" className="text-primary dark:text-dark-primary hover:underline">home</Link>.</p>
      </div>
    </div>
  )
}

