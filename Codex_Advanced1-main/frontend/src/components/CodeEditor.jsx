import React from 'react'
import Editor from '@monaco-editor/react'

export default function CodeEditor({ language='javascript', value, onChange }){
  const mapLang = language === 'python' ? 'python' : 'javascript'
  return (
    <Editor
      height="500px"
      defaultLanguage={mapLang}
      language={mapLang}
      theme="vs-dark"
      value={value}
      onChange={onChange}
      options={{ automaticLayout: true, fontSize: 14 }}
    />
  )
}
