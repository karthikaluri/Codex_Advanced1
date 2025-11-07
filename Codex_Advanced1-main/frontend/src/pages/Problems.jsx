import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Problems() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/api/problems')
            .then(r => { setList(r.data); setLoading(false) })
            .catch(e => { setError(e.response?.data?.error || e.message); setLoading(false) })
    }, [])

    if (loading) return <div className="container"><p>Loading problems...</p></div>
    if (error) return <div className="container"><p style={{ color: 'tomato' }}>Error: {error}</p></div>

    return (
        <div className="container">
            <header className="site-header">
                <div className="site-brand">codex</div>
                <nav className="site-nav"><Link to="/">Home</Link></nav>
            </header>
            <h1>Problems</h1>
            <div className="list">
                {list.map(p => (
                    <div className="card" key={p._id}>
                        <h3>{p.title} <small>{p.difficulty}</small></h3>
                        <p>{(p.description || '').substring(0, 140)}...</p>
                        <Link to={'/problems/' + p._id} className="btn ghost">Open</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
