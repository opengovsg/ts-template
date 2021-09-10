import './App.css'

import React, { useEffect, useState } from 'react'

import logo from './logo.svg'

function App() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => {
        return response.text()
      })
      .then((data) => setGreeting(data))
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{greeting}</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
