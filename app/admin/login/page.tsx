'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { apiUrl } from '@/lib/utils/api'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(apiUrl('/api/admin/auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json() as { success?: boolean; token?: string; error?: string }

      if (data.success && data.token) {
        // Store auth token in cookie (24 hours)
        document.cookie = `admin_token=${data.token}; path=/admin; max-age=86400; SameSite=Lax`
        router.push('/admin')
      } else {
        setError('Invalid password. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Elsevier Admin</h1>
          <p className="font-sans text-sm text-brand-300">Enter your admin password to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-sans text-sm font-medium text-gray-700 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <AlertCircle size={16} className="shrink-0" />
                <p className="font-sans text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full font-sans text-sm font-semibold bg-brand-700 text-white py-3 rounded-xl hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 font-sans text-xs text-brand-400">
          Protected area. Unauthorized access is not permitted.
        </p>
      </div>
    </div>
  )
}
