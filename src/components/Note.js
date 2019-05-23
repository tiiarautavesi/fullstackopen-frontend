import React from 'react'

const Note = ({ note, toggleImportance, removeNote }) => {
  const label = note.done ? 'completed' : 'uncompleted';

  return (
    <li className={label} data-time={note.time}>
      <div className="key">{note.key}</div>
      <button onClick={removeNote} className="remove-btn"></button>
      <button onClick={toggleImportance} className='imp-btn'></button>
      {note.time}  {note.content}
    </li>
  )
}

export default Note