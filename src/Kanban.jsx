import { useState } from 'react'
import { supabase } from './supabaseClient'

const COLUMNS = [
  { key: 'applied', label: 'Applied' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
]

export default function Kanban({ applications, refreshApplications }) {
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const handleDragStart = (id) => {
    setDraggedId(id)
  }

  const handleDragOver = (e, columnKey) => {
    e.preventDefault()
    setDragOverColumn(columnKey)
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedId) return

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', draggedId)

    if (error) {
      console.error('Error updating status:', error)
      alert('Could not update status.')
    } else {
      refreshApplications()
    }

    setDraggedId(null)
  }

  return (
    <div className="kanban-grid">
      {COLUMNS.map((col) => {
        const items = applications.filter((app) => app.status === col.key)
        const isOver = dragOverColumn === col.key

        return (
          <div
            key={col.key}
            className={`kanban-col ${isOver ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <h4>{col.label} ({items.length})</h4>

            {items.map((app) => (
              <div
                key={app.id}
                draggable
                onDragStart={() => handleDragStart(app.id)}
                className={`kanban-card ${draggedId === app.id ? 'dragging' : ''}`}
              >
                <strong>{app.company}</strong>
                <div className="role">{app.role}</div>
                <div className="date">{app.date_applied}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
