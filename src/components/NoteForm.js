import React from 'react'

const daysArray = ['---', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TODO']

const NoteForm = ({ 
  onSubmit,
  handleDayChange,
  handleTimeChange,
  handleContentChange,
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
            { daysArray.map(weekday => 
              <option value={weekday} key={weekday}>{weekday}</option>
            )}
          </select>
        </div>
        <div className="note-container">
          <label>Time</label>
          <select value={time} onChange={handleTimeChange}>
            <option value="">---</option>
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
            <option value="21:00">21:00</option>
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