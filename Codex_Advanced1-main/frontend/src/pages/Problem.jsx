import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useParams, Link } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'

export default function Problem() {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.get('/api/problems/' + id).then(r => {
      setProblem(r.data)
      const sc = r.data.starterCode || {}
      setCode(sc.javascript || sc.python || '')
    }).catch(e => console.error(e))
  }, [id])

  const runCode = async () => {
    setResult({ running: true })
    try {
      const res = await api.post('/api/judge/run', { language, code, problemId: id })
      setResult(res.data.result || res.data)
    } catch (err) {
      setResult({ error: err.response?.data?.error || err.message })
    }
  }

  if (!problem) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="container">
      <header><h1>{problem.title}</h1><Link to="/">← back</Link></header>
      <div className="meta"><strong>Difficulty:</strong> {problem.difficulty}</div>
      <pre className="desc">{problem.description}</pre>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <select value={language} onChange={e => { setLanguage(e.target.value); setCode(problem.starterCode[e.target.value] || '') }}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <button onClick={runCode}>Run & Judge</button>
          </div>
          <CodeEditor language={language} value={code} onChange={v => setCode(v)} />
        </div>
        <div style={{ width: 360 }}>
          <h3>Result</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          <h4>Solution (JS)</h4>
          <pre>{problem.solution.javascript}</pre>
        </div>
      </div>
    </div>
  )
}
