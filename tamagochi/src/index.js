import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {  MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <MantineProvider>
    <div style={{ width: '350px', height: '560px', padding: '20px' }}>
      <div style={{ backgroundColor: '#a8c9a3', borderRadius: '10px'}}>
        <App />
      </div>
    </div>
    </MantineProvider >
  </React.StrictMode>
)
reportWebVitals()
