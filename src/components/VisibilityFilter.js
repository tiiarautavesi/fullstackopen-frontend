import React from 'react'
import { connect } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const keysArray = ['ALL', '❤️', '🆘', '✈️', '🏖', '🍻', '🦔', '👩‍💻']

const VisibilityFilter = (props) => {

  const filterClicked = () => {
    const value = this.refs.keyType.value;
    console.log(value)
    props.store.dispatch(filterChange(value))
  }

  return (
    <div>
      <div className="note-container">
        <label>Filter by key</label>
        <select onChange={() => filterClicked()} forwardRef="keyType">
          {keysArray.map(keyicon => 
            <option value={keyicon} key={keyicon}>{keyicon}</option>
          )}
        </select>
      </div>
    </div>
  )
}

export default connect()(VisibilityFilter)