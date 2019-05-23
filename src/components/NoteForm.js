import React from 'react'
import { connect } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const daysArray = ['---', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TODO']
const timesArray = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
const keysArray = ['❤️', '🆘', '✈️', '🏖', '🍻', '🦔', '👩‍💻']

const NoteForm = ({ 
  onSubmit,
  handleKeyChange,
  handleDayChange,
  handleTimeChange,
  handleContentChange,
  key,
  day,
  time,
  content
}) => {
  return (
    <div className="createNew">
      <h2>Create new note</h2>

      <form onSubmit={onSubmit}>
        <div className="note-container">
          <label>Day</label>
          <select value={day} onChange={handleDayChange}>
            {daysArray.map(weekday => 
              <option value={weekday} key={weekday}>{weekday}</option>
            )}
          </select>
        </div>
        <div className="note-container">
          <label>Time</label>
          <select value={time} onChange={handleTimeChange}>
            <option value="">---</option>
            {timesArray.map(time => 
              <option value={time} key={time}>{time}</option>
            )}
          </select>
        </div>
        <div className="note-container">
          <label>Key</label>
          <select value={key} onChange={handleKeyChange}>
            {keysArray.map(keyicon => 
              <option value={keyicon} key={keyicon}>{keyicon}</option>
            )}
          </select>
        </div>
        <div className="note-container">
          <label>Content</label>
          <input
            value={content}
            onChange={handleContentChange}
          />
        </div>
        <button type="submit" className="submit-btn"></button>
      </form>
    </div>
  )
}

export default NoteForm