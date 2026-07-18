import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-wrap">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-signal)', marginBottom: '8px' }}>
        $ ./auth --{isSignUp ? 'register' : 'login'}
      </p>
      <h2>{isSignUp ? 'Create an account' : 'Log in'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      {errorMsg && <p className="auth-error">{errorMsg}</p>}

      <p className="auth-switch">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setErrorMsg('')
          }}
        >
          {isSignUp ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}
