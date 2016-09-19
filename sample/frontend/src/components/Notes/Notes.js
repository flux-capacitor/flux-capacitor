import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createNote } from '../../ducks/notes'
import Note from './Note'
import './Notes.css'

const propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCreateNote: PropTypes.func.isRequired
}

function Notes ({ notes, onCreateNote }) {
  return (
    <section className='Notes'>
      <button onClick={onCreateNote}>+ Create note</button>
      <ul className='NotesList'>
        {notes
          .sort((a, b) => (a.id < b.id))
          .map((note, index) => <Note key={note.id || 'index-' + index} note={note} />)}
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

function mapDispatchToProps (dispatch) {
  return {
    onCreateNote: () => dispatch(createNote())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notes)
