import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { isAuthed } from '../api/axios'

export default function History() {
    const [subs, setSubs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthed()) {
            setError('Please sign in to see your history.')
            setLoading(false)
            return
        }
        api.get('/api/judge/history')
            .then(r => { setSubs(r.data); setLoading(false) })
            .catch(e => { setError(e.response?.data?.error || e.message); setLoading(false) })
    }, [])

    if (loading) return <div className="container"><p>Loading history...</p></div>
    if (error) return <div className="container"><p style={{ color: 'tomato' }}>Error: {error}</p></div>

    return (
        <div className="container">
            <header className="site-header">
                <div className="site-brand">codex</div>
                <nav className="site-nav"><Link to="/">Home</Link><Link to="/problems">Browse</Link></nav>
            </header>
            <h1>Your submission history</h1>
            {subs.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <div className="list">
                    {subs.map(s => (
                        <div className="card" key={s._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{s.problem?.title || 'Unknown problem'}</strong>
                                <span>{new Date(s.createdAt).toLocaleString()}</span>
                            </div>
                            <div style={{ margin: '6px 0' }}>
                                <span className="muted">Language:</span> {s.language}
                            </div>
                            <div>
                                <span className="muted">Result:</span> {s.result?.success ? 'Passed' : 'Failed'}
                            </div>
                            <Link to={'/problems/' + (s.problem?._id || '')} className="btn ghost" style={{ marginTop: 8 }}>Open problem</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
