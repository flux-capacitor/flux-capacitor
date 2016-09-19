import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeUserName } from '../../ducks/userName'
import './AuthBox.css'

const propTypes = {
  userName: PropTypes.string.isRequired,
  onChangeUserName: PropTypes.func.isRequired
}

function AuthBox ({ userName, onChangeUserName }) {
  return (
    <section className='AuthBox'>
      <label>
        <span>Current user:</span>
        <input
          placeholder='User name'
          type='text'
          value={userName}
          onChange={(event) => onChangeUserName(event.target.value)}
        />
      </label>
    </section>
  )
}

AuthBox.propTypes = propTypes

function mapStateToProps (state) {
  return {
    userName: state.userName
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onChangeUserName: (userName) => dispatch(changeUserName(userName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthBox)
