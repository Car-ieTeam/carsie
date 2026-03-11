'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpPage() {
    const router = useRouter()
    const [role, setRole] = useState<'driver' | 'expert'> ('driver')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSignUp() {
        setError('')
        setLoading(true)
        //creating the user in Supabase (db)
        const { data, error: signupError } = await supabase.auth.signUp({email, password})
        
        if (signupError) {
            setError(signupError.message)
            setLoading(false)
            return
        }

        //step 2: save their roles to profiles DB
        const {error : profileError } = await supabase
            .from('profiles')
            .insert({ id:data.user!.id, email, role })

        if (profileError) {
            setError(profileError.message)
            setLoading(false)
            return
        }
        if (role === 'expert') {
            router.push('/dashboard/expert')
        } else {
            router.push('/dashboard/driver')
        }

    }

    return (
        <div>
            <div>
                {/**Helping choose roles */}
                <div
                    onClick={() => setRole('driver')}
                >
                    Driver
                </div>

                <div
                    onClick={() => setRole('expert')
                    }
                >
                    Expert   
                </div>
            </div>

            <div>
                <label> Email:</label>
                <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                />
            </div>
            <div>
                <label> Password</label>
                <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8. characters"
                />
            </div>

            <button onClick={handleSignUp} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div>
                Already have an account? <Link href="/login">Log In</Link>
            </div>
        </div>
    )
}