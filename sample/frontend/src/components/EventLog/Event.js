import React, { PropTypes } from 'react'
import createMessageForEvent from '../../formatters/event'
import './Event.css'

const propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    meta: PropTypes.object,
    payload: PropTypes.object.isRequired,
    user: PropTypes.string,
  }).isRequired
}

function Event ({ event }) {
  return (
    <li className='Event'>
      <span className='Event-id'>{event.id}</span>
      <span className='Event-message'>{createMessageForEvent(event)}</span>
    </li>
  )
}

Event.propTypes = propTypes

export default Event
