import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { loadEvents } from '../../ducks/events'
import { loadNotes } from '../../ducks/notes'
import AuthBox from '../AuthBox/AuthBox'
import EventLog from '../EventLog/EventLog'
import Notes from '../Notes/Notes'
import logo from './logo.svg'
import './App.css'

const propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired
  }).isRequired
}

class App extends Component {
  componentWillMount () {
    const { store } = this.props

    store.dispatch(loadEvents('/api/events?limit=50&order=DESC'))
    store.dispatch(loadNotes('/api/notes'))
  }

  render () {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <section className="App-intro">
            <AuthBox />
            <Notes />
            <EventLog />
          </section>
        </div>
      </Provider>
    )
  }
}

App.propTypes = propTypes

export default App
