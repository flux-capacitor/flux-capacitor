import React, { Component, PropTypes } from 'react'
import notie from 'notie'
import { connect } from 'react-redux'
import { postJson } from '../../communication/rest'
import { removeUnsavedNote } from '../../ducks/notes'
import ActionButtons from './ActionButtons'
import './Note.css'

const propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,       // Might be undefined if it's a newly created note (not yet sent to the backend)
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  userName: PropTypes.string.isRequired,
  onRemoveUnsaved: PropTypes.func.isRequired,
  onSaveNewNote: PropTypes.func.isRequired
}

class Note extends Component {
  constructor (props) {
    super(props)

    const { note } = this.props

    this.state = {
      isEditing: this.isJustCreated(),
      noteData: {
        title: note.title,
        text: note.text
      }
    }
    this.title = null
  }

  componentDidMount () {
    setTimeout(() => {
      this.title.focus()
    }, 1000)    // small delay for the animation to complete
  }

  isJustCreated () {
    return !this.props.note.id
  }

  getNextNoteId () {
    const { notes } = this.props
    const maxId = notes.reduce((max, note) => (
      note.id ? Math.max(parseInt(note.id, 10), max) : max
    ), 0)
    return String(maxId + 1)
  }

  leaveEditMode () {
    const { onRemoveUnsaved } = this.props

    if (this.isJustCreated()) {
      onRemoveUnsaved()
    }
    this.setState({ isEditing: false })
  }

  saveNote () {
    const { userName, onSaveNewNote, onSaveUpdatedNote, onRemoveUnsaved } = this.props

    if (this.isJustCreated()) {
      const id = this.getNextNoteId()
      const note = Object.assign({}, this.state.noteData, { id })
      onSaveNewNote(note, userName).then(() => onRemoveUnsaved())
    } else {
      const note = Object.assign({}, this.props.note, this.state.noteData)
      onSaveUpdatedNote(note, userName)
    }
    this.setState({ isEditing: false })
  }

  destroy () {
    const { note, userName, onDestroy } = this.props
    const message = `Sure you want to delete "${note.title}"?`

    notie.confirm(message, 'Cancel', 'Delete', () => {}, () => onDestroy(note.id, userName))
  }

  render () {
    const { isEditing } = this.state
    const note = isEditing ? this.state.noteData : this.props.note

    const setter = (name) => (event) => this.setState({
      noteData: Object.assign({}, this.state.noteData, { [name]: event.target.textContent })
    })

    return (
      <div className='Note'>
        <ActionButtons
          isEditing={isEditing}
          onClose={() => this.leaveEditMode()}
          onEdit={() => this.setState({ isEditing: true })}
          onRemove={() => this.destroy()}
          onSave={() => this.saveNote()}
        />

        <h5
          className='Note-title' ref={(ref) => { this.title = ref }}
          contentEditable={isEditing} onInput={setter('title')}
        >{note.title}</h5>
        <hr />
        <p className='Note-text' contentEditable={isEditing} onInput={setter('text')}>
          {note.text}
        </p>
      </div>
    )
  }
}

Note.propTypes = propTypes

function mapStateToProps (state) {
  return {
    notes: state.notes,
    userName: state.userName
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onDestroy: (noteId, userName) => postJson(`/api/command/removeNote?user=${userName}`, { id: noteId }),
    onRemoveUnsaved: () => dispatch(removeUnsavedNote()),
    onSaveNewNote: (note, userName) => postJson(`/api/command/addNote?user=${userName}`, note),
    onSaveUpdatedNote: (note, userName) => postJson(`/api/command/updateNote?user=${userName}`, note)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Note)
