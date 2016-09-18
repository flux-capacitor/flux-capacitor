import React, { PropTypes } from 'react'

const propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired
}

function Note ({ note }) {
  return (
    <li className='Note'>
      <h4 className='Note-title'>{note.title}</h4>
      <p className='Note-text'>
        {note.text}
      </p>
    </li>
  )
}

Note.propTypes = propTypes

export default Note
