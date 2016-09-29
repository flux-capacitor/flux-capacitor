import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import FlipMove from 'react-flip-move'
import PlusIcon from 'react-icons/lib/ti/plus'
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
      <button className='Notes-AddButton' onClick={onCreateNote}><PlusIcon /> Create note</button>
      <div className='NotesList'>
        <FlipMove enterAnimation='elevator' leaveAnimation='fade' duration={350}>
          {notes
            .sort((a, b) => (a.createdAt < b.createdAt))
            .map((note, index) => <Note key={note.id} note={note} />)}
        </FlipMove>
        {notes.length === 0 ? <div className='NotesList-NoNotes'>No notes yet</div> : null}
      </div>
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
