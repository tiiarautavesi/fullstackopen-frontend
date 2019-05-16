import React, { useState, useEffect } from 'react' 
import Note from './components/Note'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import loginService from './services/login' 

const daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TODO']

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [time, setTime] = useState('')
  const [day, setDay] = useState('')
  const [content, setContent] = useState('')
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
    : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      time: time,
      day: day,
      content: content,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    console.log(noteObject);
    noteService
      .create(noteObject).then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const handleNoteChange = (event) => {
    setDay('')
    setTime('')
    setContent('')
  }

  const rows = (weekday) => notesToShow.map(note =>
    weekday === note.day ?
    <Note
      key={note.id}
      note={note}
      toggleImportance={() => toggleImportanceOf(note.id)}
      removeNote={() => removeNote(note.id)}
    />
    : console.log(weekday)
  )

  const getCurrentDay = (weekday) => {
    /* Select and mark the current day */
    const d = new Date();
    const dayInt = d.getDay() - 1;
    const currDay = daysArray[dayInt];
    const selectCurrDay = weekday === currDay ? 'today' : '';
    return selectCurrDay;
  }

  const days = () => (
    daysArray.map (weekday =>
      <div className="day-container" key={weekday}>
        <h2 className={getCurrentDay(weekday)}>{weekday}</h2>
        <ul>
          {rows(weekday)}
        </ul>
      </div>
    )
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
    <Togglable buttonLabel="Add note" ref={noteFormRef}>
      <NoteForm
        onSubmit={addNote}
        time={time}
        day={day}
        content={content}
        handleTimeChange={({ target }) => setTime(target.value)}
        handleDayChange={({ target }) => setDay(target.value)}
        handleContentChange={({ target }) => setContent(target.value)}
        handleSubmit={handleNoteChange}
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
              Show {showAll ? 'only events' : 'all'}
            </button>
          </div>
          <div className="days-container">
          {days()}
          </div>
        </div>
      }
      
     
    </div>
  )
}

export default App