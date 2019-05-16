import React from 'react'

const Note = ({ note, toggleImportance, removeNote }) => {
  const label = note.important ? 'imp-btn makeUnimportant' : 'imp-btn makeImportant';

  return (
    <li className={note.day}><button onClick={removeNote} className="remove-btn"></button><button onClick={toggleImportance} className={label}></button>{note.time} {note.content}</li>
  )
}

export default Note