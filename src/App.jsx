import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Dashboard from './Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <p style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
        Loading...
      </p>
    )
  }

  if (!session) return <Auth />

  return (
    <div className="dash-wrap">
      <div className="dash-header">
        <h2>Job Application Tracker</h2>
        <button className="btn-ghost" onClick={handleLogout}>Log out</button>
      </div>
      <p className="dash-email">{session.user.email}</p>
      <Dashboard session={session} />
    </div>
  )
}

export default App
