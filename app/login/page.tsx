"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from "@/lib/supabase/client"

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')

    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    // Initialize state based on query param
    useEffect(() => {
        if (mode === 'signup') {
            setIsSignUp(true)
        } else if (mode === 'signin') {
            setIsSignUp(false)
        }
    }, [mode])

    // Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')

    const [successMessage, setSuccessMessage] = useState('')
    const [error, setError] = useState('')

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setIsLoading(true)

        try {
            if (isSignUp) {
                // 1. Validate Passwords
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match")
                }

                // 2. Sign Up Call
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name },
                        // Redirect to callback if needed
                        // emailRedirectTo: `${window.location.origin}/auth/callback`, 
                    }
                })
                if (signUpError) throw signUpError

                if (data.session) {
                    setSuccessMessage("Account created successfully! Redirecting...")
                    router.push('/dashboard')
                    router.refresh()
                } else {
                    // This fallback handles the case where "Confirm Email" is effectively ENABLED in Supabase
                    // despite the user wanting to disable it.
                    setSuccessMessage("Account created! Please check your email to confirm.")
                }
            } else {
                // 3. Sign In Call
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (signInError) throw signInError

                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
            })
            if (error) throw error
            setSuccessMessage("Reset link sent to your email.")
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to send reset email")
        } finally {
            setIsLoading(false)
        }
    }

    if (showForgotPassword) {
        return (
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Reset Password
                    </h1>
                    <p className="text-gray-400">Enter your email to receive reset instructions.</p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-gray-300">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 focus:border-[#F1C086]/50"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {successMessage && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> {successMessage}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 font-bold text-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-400">
                    {isSignUp ? "Start your intelligent investment journey" : "Sign in to access your portfolio"}
                </p>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#1A1A1A] rounded-xl border border-white/10">
                <button
                    onClick={() => setIsSignUp(false)}
                    className={`py-2.5 text-sm font-medium rounded-lg outline-none focus:outline-none ring-0 focus:ring-0 transition-colors duration-200 ${!isSignUp
                        ? 'bg-[#2A2A2A] text-white shadow-lg'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setIsSignUp(true)}
                    className={`py-2.5 text-sm font-medium rounded-lg outline-none focus:outline-none ring-0 focus:ring-0 transition-colors duration-200 ${isSignUp
                        ? 'bg-[#2A2A2A] text-white shadow-lg'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                >
                    Sign Up
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5">

                {isSignUp && (
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="pl-10 bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 focus:border-[#F1C086]/50"
                                required={isSignUp}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 focus:border-[#F1C086]/50"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-gray-300">Password</Label>
                        {!isSignUp && (
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs text-[#F1C086] hover:text-[#F6B88C] transition-colors"
                            >
                                Forgot password?
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 focus:border-[#F1C086]/50"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {isSignUp && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 focus:border-[#F1C086]/50"
                                required={isSignUp}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> {successMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#F1C086] to-[#F6B88C] text-[#0E0E10] hover:opacity-90 font-bold text-lg shadow-[0_0_20px_rgba(241,192,134,0.2)] hover:shadow-[0_0_30px_rgba(241,192,134,0.3)] transition-all"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSignUp ? (
                        <span className="flex items-center gap-2">Get Started <ArrowRight className="w-5 h-5" /></span>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-500">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[#F1C086] hover:underline font-medium"
                >
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0E0E10] flex flex-col relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[#F1C086]/5 blur-[120px] rounded-b-full pointer-events-none" />

            {/* Top Nav */}
            <div className="p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="mb-8 transform scale-110">
                    <Logo />
                </div>

                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <LoginContent />
                </Suspense>
            </div>
        </div>
    )
}
