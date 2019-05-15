import React from 'react'

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'imp-btn makeUnimportant' : 'imp-btn makeImportant';

  return (
    <li><button onClick={toggleImportance} className={label}></button>{note.content}</li>
  )
}

export default Note