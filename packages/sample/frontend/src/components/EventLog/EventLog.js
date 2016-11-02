import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RawViewLink from '../RawView/RawViewLink'
import Event from './Event'
import './EventLog.css'

const propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
}

function EventLog ({ events }) {
  const by = (prop) => (a, b) => (a[ prop ] > b[ prop ] ? 1 : -1)
  const sortedEvents = [].concat(events).sort(by('timestamp')).reverse()

  return (
    <section className='EventLog'>
      <h3>Recent events</h3>
      <RawViewLink className='EventLog-raw' contentTitle='GET /api/events' rawContent={sortedEvents} />

      <ul className='EventLogList'>
        {sortedEvents.map((event, index) => <Event key={index} event={event} />)}
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
