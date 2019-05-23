import noteService from '../services/notes'

// Default state doesn't have any notes: state = []
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return [...state, action.data]
    case 'INIT_NOTES':
      return action.data  
    case 'TOGGLE_COMPLETED':
      const id = action.data.id
      const changedNote = { ...action.data, 
        done: !action.data.done 
      }
      console.log('already mapped', action.data.done)
      return state.map(note => note.id !== id ? note : changedNote)
    case 'DELETE_NOTE':
      const idDelete = action.data.id
      const noteToDelete = state.find(n => n.idDelete === idDelete)
      return state.map(note => note.id !== idDelete ? note : noteToDelete)
    default:
      return state
  }
}

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch({
      type: 'INIT_NOTES',
      data: notes,
    })
  }
}

export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote,
    })
  }
}

export const toggleImportanceOf = changedNote => {
  return async dispatch => {
    const notes = await noteService.update(changedNote)
    dispatch({
      type: 'TOGGLE_COMPLETED',
      data: changedNote,
    })
  }
}

export const removeNote = noteToDelete => {
  return async dispatch => {
    const notes = await noteService.remove(noteToDelete)
    dispatch({
      type: 'DELETE_NOTE',
      data: notes,
    })
  }
}

export default noteReducer