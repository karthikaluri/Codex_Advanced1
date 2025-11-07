
import React, { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      nav('/')
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">codex</div>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue to Codex</p>
        <form onSubmit={submit} className="auth-form">
          <label>Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn">Sign in</button>
        </form>
        <div className="auth-foot">Don't have an account? <a href="/register">Create one</a></div>
      </div>
    </div>
  )
}
