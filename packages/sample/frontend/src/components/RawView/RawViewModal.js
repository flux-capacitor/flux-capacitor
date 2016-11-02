import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { hide } from '../../ducks/rawView'

const propTypes = {
  content: PropTypes.string,
  isOpen: PropTypes.bool,
  title: PropTypes.string
}

function RawViewModal ({ content, isOpen, title, onClose }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>{title}</h2>
      <pre>
        <code>
          {content}
        </code>
      </pre>
    </Modal>
  )
}

RawViewModal.propTypes = propTypes

function mapStateToProps (state) {
  const { rawView } = state

  return {
    isOpen: !!rawView,
    title: rawView && rawView.title,
    content: rawView && rawView.content
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(hide())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RawViewModal)
