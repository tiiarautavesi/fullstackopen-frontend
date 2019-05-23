import React, { useState, useEffect } from 'react' // Import hooks
import { connect } from 'react-redux'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login'
import { initializeNotes } from './reducers/noteReducer'
import VisibilityFilter from './components/VisibilityFilter'
import Notes from './components/Notes'


const daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TODO']

const App = (props) => { // Creating custom hooks to create reusable functions
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [key, setKey] = useState('')
  const [time, setTime] = useState('')
  const [day, setDay] = useState('')
  const [content, setContent] = useState('')
  const [user, setUser] = useState(null)

  // hook initializes the notes
  useEffect(() => {
    props.initializeNotes()
  },[])

  /*
  useEffect(() => {
    noteService
      .getAll().then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  */

  // effect hook returns the user's logged in state from local storage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  /*
  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, done: !note.done }

    noteService
      .update(changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `note: '${note.content}' has already been removed from the database`
        );
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const removeNote = id => {
    const note = notes.find(n => n.id === id)

    noteService
      .remove(note).then(returnedNote => {
        setNotes(notes.filter(n => n.id !== id))
      })
      .catch(error => {
        alert(
          `note: '${note.content}' has already been removed from the database`
        );
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.done)

  const handleNoteChange = (event) => {
    setKey('')
    setDay('')
    setTime('')
    setContent('')
  }
  */
  
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
    <Togglable buttonLabel="Add note" ref={noteFormRef}>
      <NoteForm
        //(onSubmit={addNote}
        time={time}
        day={day}
        key={key}
        content={content}
        handleTimeChange={({ target }) => setTime(target.value)}
        handleDayChange={({ target }) => setDay(target.value)}
        handleKeyChange={({ target }) => setKey(target.value)}
        handleContentChange={({ target }) => setContent(target.value)}
        //handleSubmit={handleNoteChange}
      />
    </Togglable>
  )

  const logOut = async (event) => {
    /* Log out and refresh */
    event.preventDefault();
    window.localStorage.clear();
    window.location.reload();
  }

  // Returns the ISO week of the date.
  const getNumberOfWeek = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }


  return (
    <div>
      
      <h1>Bullet journal week {getNumberOfWeek()}</h1>

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
              Show {showAll ? 'only undone' : 'all'}
            </button>
          </div>
          <VisibilityFilter />
          <Notes />
        </div>
      }
      
    </div>
  )
}

export default connect(null, {initializeNotes})(App)