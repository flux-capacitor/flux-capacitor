import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import initStore from './store/initStore'
import './index.css'

ReactDOM.render(
  <App store={initStore()} />,
  document.getElementById('root')
)
