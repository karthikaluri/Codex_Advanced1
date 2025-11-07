
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api, { isAuthed } from '../api/axios'

export default function Home() {
  const [problems, setProblems] = useState([])
  const [authed, setAuthed] = useState(isAuthed())
  const [banner, setBanner] = useState('')
  const location = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    api.get('/api/problems').then(r => setProblems(r.data)).catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if (location.state?.welcome) setBanner('Welcome, coder')
  }, [location.state])

  const logout = () => {
    localStorage.removeItem('token')
    setAuthed(false)
    nav(0)
  }
  return (
    <div className="container">
      <header className="site-header">
        <div className="site-brand">codex</div>
        <nav className="site-nav">
          {authed ? (
            <>
              <Link to="/problems">Browse</Link>
              <Link to="/history">History</Link>
              <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      {banner && (
        <div className="card" style={{ marginBottom: 16 }}>
          {banner}
        </div>
      )}

      <section className="hero">
        <h1>Codex — Advanced problem solving</h1>
        <p className="muted">Practice, submit, and improve. Beautiful UI, powerful backend.</p>
        <div className="hero-actions">
          {!authed && <Link to="/register" className="btn">Get started</Link>}
          <Link to="/problems" className="btn ghost">Browse problems</Link>
        </div>
      </section>

      <h2>Latest problems</h2>
      <div className="list">
        {problems.map(p => (
          <div className="card" key={p._id}>
            <h3>{p.title} <small>{p.difficulty}</small></h3>
            <p>{p.description.substring(0, 120)}...</p>
            <Link to={'/problems/' + p._id}>Open</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
