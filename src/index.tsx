import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './data/store'
import './index.css'
import App from './App'
import { TrailerProvider } from './context/TrailerContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <TrailerProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </TrailerProvider>
    </Provider>
  </React.StrictMode>
)
