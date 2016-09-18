import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Note from './Note'

const propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired
}

function Notes ({ notes }) {
  return (
    <section className='Notes'>
      <h3>Notes</h3>
      <ul className='NotesList'>
        {notes.map((note, index) => <Note key={index} note={note} />)}
      </ul>
    </section>
  )
}

Notes.propTypes = propTypes

function mapStateToProps (state) {
  return {
    notes: state.notes
  }
}

export default connect(mapStateToProps)(Notes)
