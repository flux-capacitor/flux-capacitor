/* eslint-env browser */

import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { loadEvents } from '../../ducks/events'
import { loadNotes } from '../../ducks/notes'
import AuthBox from '../AuthBox/AuthBox'
import EventLog from '../EventLog/EventLog'
import Notes from '../Notes/Notes'
import RawViewModal from '../RawView/RawViewModal'
import logo from './logo.svg'
import './App.css'

const propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired
  }).isRequired
}

class App extends Component {
  state = { websocket: null }

  componentWillMount () {
    const { store } = this.props

    store.dispatch(loadEvents('/api/events?limit=50&order=DESC'))
    store.dispatch(loadNotes('/api/notes?order=DESC'))

    this.setState({ websocket: this.connectToWebsocket(store) })
  }

  componentWillUnmount () {
    const { websocket } = this.state
    websocket.close()
  }

  connectToWebsocket (store) {
    const { hostname, port } = document.location
    const fixedPort = parseInt(port, 10) === 3000 ? 4000 : port   // so the dev server proxy is not used

    const websocket = new WebSocket(`ws://${hostname}:${fixedPort}/websocket`)
    websocket.onmessage = this.onWebSocketMessage.bind(this, store)

    return websocket
  }

  onWebSocketMessage (store, event) {
    const remoteEvents = JSON.parse(event.data)
    remoteEvents.forEach((remoteEvent) => store.dispatch(remoteEvent))
  }

  render () {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div className='App'>
          <div className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
          </div>
          <section className='App-intro'>
            <AuthBox />
            <div className='clear flex-row'>
              <Notes />
              <EventLog />
            </div>
            <div className='text-justify'>
              <h5>What is happening here?</h5>
              <p>
                The <a href="https://github.com/flux-capacitor/flux-capacitor">⚛&nbsp;<b>Flux Capacitor</b></a> powers
                the event log and the realtime updates. It handles the dispatched events (actions) and invokes the reducers.
              </p>
              <p>
                The notes and the last 50 events are initially requested from the
                server and a websocket connection pushes every new event in realtime.
              </p>
              <p>
                The pushed events are reduced on the client to update the notes
                using the backend reducer and <a href="https://www.npmjs.com/package/flux-capacitor-reduxify">reduxify</a>.
              </p>
              <p>
                All the data here is live data from the server. Try opening this app in
                a new window and change something there!
              </p>
            </div>
          </section>
          <RawViewModal />
        </div>
      </Provider>
    )
  }
}

App.propTypes = propTypes

export default App
