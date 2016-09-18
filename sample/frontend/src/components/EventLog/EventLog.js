import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Event from './Event'
import './EventLog.css'

const propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

function EventLog ({ events }) {
  return (
    <section className='EventLog'>
      <h3>Recent events</h3>
      <ul className='EventLogList'>
        {events.map((event, index) => <Event key={index} event={event} />)}
      </ul>
    </section>
  )
}

EventLog.propTypes = propTypes

function mapStateToProps (state) {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(EventLog)
