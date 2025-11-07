
import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      alert('Registered')
      nav('/', { state: { welcome: true } })
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">codex</div>
        <h2>Create account</h2>
        <p className="muted">Join Codex and start solving problems</p>
        <form onSubmit={submit} className="auth-form">
          <label>Full name</label>
          <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input placeholder="Choose a password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn">Create account</button>
        </form>
        <div className="auth-foot">Already have an account? <a href="/login">Sign in</a></div>
      </div>
    </div>
  )
}
