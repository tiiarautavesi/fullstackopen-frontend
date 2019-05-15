import React, { useState, useEffect } from 'react' 
import Note from './components/Note'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login' 


const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // effect hook returns the user's logged in state from local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `muistiinpano '${note.content}' on jo valitettavasti poistettu palvelimelta`
        );
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject).then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const rows = () => notesToShow.map(note =>
    <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
    />
  )

  const loginForm = () => {
    return (
      <Togglable buttonLabel='Log in'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      ) 

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('käyttäjätunnus tai salasana virheellinen')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  /* React's ref-mechanism can collect data of the component's "state" */
  const noteFormRef = React.createRef()

  const noteForm = () => (
    /* Toggle the note creation form */
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm
        onSubmit={addNote}
        value={newNote}
        handleChange={handleNoteChange}
      />
    </Togglable>
  )

  const logOut = async (event) => {
    /* Log out and refresh */
    event.preventDefault();
    window.localStorage.clear();
    window.location.reload();
  }


  return (
    <div>
      
      <h1>Bullet journal weekly</h1>

      <Notification message={errorMessage} />

      {user === null ?
        <div className="login-container">{loginForm()}</div> :
        <div>
          <div className="menu">
            <p>{user.name} is logged in</p>
            <button onClick={logOut}>Log Out</button>
          </div>
            {noteForm()}
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              Show {showAll ? 'only important' : 'all'}
            </button>
          </div>
          <ul>
            {rows()}
          </ul>
        </div>
      }
      
     
    </div>
  )
}

export default App