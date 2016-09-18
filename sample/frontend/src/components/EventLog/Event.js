import React, { PropTypes } from 'react'
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

function createMessageForEvent (event) {
  const { payload, type } = event
  const { user } = event.meta

  switch (type) {
    case 'noteAdded':
      return `${user} added note "${payload.title}" (${payload.id})`
    case 'noteTitleEdited':
      return `${user} changed the title of note ${payload.id} to "${payload.title}"`
    case 'noteContentEdited':
      return `${user} changed the content of note ${payload.id} to "${payload.content}"`
    case 'noteRemoved':
      return `${user} deleted note ${payload.id}`
    default:
      return `Event ${type} created by ${user}`
  }
}

Event.propTypes = propTypes

export default Event
