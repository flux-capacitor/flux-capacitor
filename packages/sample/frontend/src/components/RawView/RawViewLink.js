import React, { PropTypes } from 'react'
import CodeIcon from 'react-icons/lib/fa/code'
import { connect } from 'react-redux'
import { show } from '../../ducks/rawView'

const propTypes = {
  className: PropTypes.string,
  contentTitle: PropTypes.string.isRequired,
  rawContent: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  onShow: PropTypes.func.isRequired
}

function RawViewLink ({ className, contentTitle, rawContent, onShow }) {
  const content = typeof rawContent !== 'string' ? JSON.stringify(rawContent, null, 2) : rawContent
  return (
    <a className={className} onClick={() => onShow(contentTitle, content)}>
      <CodeIcon /> View raw
    </a>
  )
}

RawViewLink.propTypes = propTypes

function mapDispatchToProps (dispatch) {
  return {
    onShow: (contentTitle, rawContent) => dispatch(show(contentTitle, rawContent))
  }
}

export default connect(() => ({}), mapDispatchToProps)(RawViewLink)
