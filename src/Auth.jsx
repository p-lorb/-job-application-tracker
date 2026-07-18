import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg(error.message)
    }

    setLoading(false)
  }

  const fillDemoCredentials = () => {
    setEmail('demo@jobtracker.com')
    setPassword('demo1234')
  }

  return (
    <div className="auth-wrap">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-signal)', marginBottom: '8px' }}>
        $ ./auth --login
      </p>
      <h2>Log in</h2>
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
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : 'Log In'}
        </button>
      </form>

      {errorMsg && <p className="auth-error">{errorMsg}</p>}

      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--text-dim)',
      }}>
        <p style={{ marginBottom: '8px' }}>This is a portfolio demo — sign-ups are disabled.</p>
        <p style={{ marginBottom: '10px' }}>
          demo@jobtracker.com / demo1234
        </p>
        <button
          type="button"
          onClick={fillDemoCredentials}
          style={{
            background: 'none',
            border: '1px solid var(--border-strong)',
            color: 'var(--accent-signal)',
            borderRadius: '4px',
            padding: '6px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Fill demo credentials
        </button>
      </div>
    </div>
  )
}
