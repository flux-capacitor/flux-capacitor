import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import initStore from './initStore'
import 'rc-tooltip/assets/bootstrap.css'
import './index.css'

ReactDOM.render(
  <App store={initStore()} />,
  document.getElementById('root')
)
