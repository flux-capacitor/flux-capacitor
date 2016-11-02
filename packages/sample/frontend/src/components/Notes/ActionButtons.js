import React, { PropTypes } from 'react'
import Tooltip from 'rc-tooltip'
import CloseIcon from 'react-icons/lib/fa/close'
import EditIcon from 'react-icons/lib/fa/edit'
import FloppyIcon from 'react-icons/lib/fa/floppy-o'
import TrashIcon from 'react-icons/lib/fa/trash'
import './ActionButtons.css'

const buttonSize = 24

const propTypes = {
  isEditing: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

function ActionButtons ({ isEditing, onClose, onEdit, onRemove, onSave }) {
  return isEditing
    ? <EditingActions className='Note-ActionButtons' {...{ onClose, onSave }} />
    : <NonEditingActions className='Note-ActionButtons' {...{ onEdit, onRemove }} />
}

ActionButtons.propTypes = propTypes

function EditingActions ({ className, onClose, onSave }) {
  return (
    <div className={className}>
      <Icon Icon={CloseIcon} onClick={() => onClose()} tooltip='Leave edit mode' />
      <Icon Icon={FloppyIcon} onClick={() => onSave()} tooltip='Save' />
    </div>
  )
}

function NonEditingActions ({ className, onEdit, onRemove }) {
  return (
    <div className={className}>
      <Icon Icon={EditIcon} onClick={() => onEdit()} tooltip='Edit' />
      <Icon Icon={TrashIcon} onClick={() => onRemove()} tooltip='Delete' />
    </div>
  )
}

function Icon ({ Icon, onClick, tooltip }) {
  return (
    <Tooltip overlay={tooltip} overlayClassName='sans-serif' placement='bottom'>
      <Icon onClick={onClick} size={buttonSize} />
    </Tooltip>
  )
}

export default ActionButtons
