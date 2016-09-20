import React, { PropTypes } from 'react'
import createMessageForEvent from '../../formatters/event'
import './Event.css'

const propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    meta: PropTypes.object,
    payload: PropTypes.object.isRequired,
    user: PropTypes.string,
  }).isRequired
}

function Event ({ event }) {
  const formatId = (id) => (String(id).replace(/-.*/, ''))
  const formatDate = (date) => (date.toLocaleDateString() + ' ' + date.toLocaleTimeString())
  const formatDateIfSet = (string) => (string && formatDate(new Date(string)))

  return (
    <li className='Event sans-serif'>
      <span className='Event-meta'>
        <span className='Event-id'>{formatId(event.id)}</span>
        <span className='Event-time'>{formatDateIfSet(event.timestamp)}</span>
      </span>
      <span className='Event-message'>{createMessageForEvent(event)}</span>
    </li>
  )
}

Event.propTypes = propTypes

export default Event
