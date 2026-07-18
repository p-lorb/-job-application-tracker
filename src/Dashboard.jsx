import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Kanban from './Kanban'

const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected']

export default function Dashboard({ session }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState('list')

  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'applied',
    date_applied: new Date().toISOString().slice(0, 10),
    notes: '',
    contact_person: '',
    follow_up_date: '',
    links: '',
  })

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('date_applied', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
    } else {
      setApplications(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('applications').insert([
      {
        ...form,
        user_id: session.user.id,
        follow_up_date: form.follow_up_date || null,
      },
    ])

    if (error) {
      console.error('Error adding application:', error)
      alert('Something went wrong adding this application.')
      return
    }

    setForm({
      company: '',
      role: '',
      status: 'applied',
      date_applied: new Date().toISOString().slice(0, 10),
      notes: '',
      contact_person: '',
      follow_up_date: '',
      links: '',
    })
    setShowForm(false)
    fetchApplications()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return

    const { error } = await supabase.from('applications').delete().eq('id', id)

    if (error) {
      console.error('Error deleting application:', error)
      return
    }
    fetchApplications()
  }

  return (
    <div>
      <div className="toolbar">
        <h3>$ ls ./applications ({applications.length})</h3>
        <div className="toolbar-actions">
          <button
            className={`btn-ghost ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List
          </button>
          <button
            className={`btn-ghost ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            Kanban
          </button>
          <button className="btn-ghost" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Application'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="app-form">
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />

          <select name="status" value={form.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input type="date" name="date_applied" value={form.date_applied} onChange={handleChange} required />

          <input name="contact_person" placeholder="Contact person" value={form.contact_person} onChange={handleChange} />
          <input type="date" name="follow_up_date" value={form.follow_up_date} onChange={handleChange} />

          <input name="links" placeholder="Links (job posting, etc.)" value={form.links} onChange={handleChange} className="span-2" />
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={3} className="span-2" />

          <button type="submit" className="btn-primary span-2">Save Application</button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="empty-state">No applications yet. Add your first one above.</p>
      ) : view === 'kanban' ? (
        <Kanban applications={applications} refreshApplications={fetchApplications} />
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Follow-up</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.company}</td>
                <td>{app.role}</td>
                <td><span className={`status-pill status-${app.status}`}>{app.status}</span></td>
                <td>{app.date_applied}</td>
                <td>{app.follow_up_date || '—'}</td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(app.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
