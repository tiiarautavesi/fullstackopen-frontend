import React from 'react'
import { connect } from 'react-redux'
import Note from './Note'
import { toggleImportanceOf, removeNote } from '../reducers/noteReducer'

const daysArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TODO']

const Notes = (props) => {

  // Sort notes in order by assigned time
  const sortedNotes = props.visibleNotes.sort(function (a, b) {
    return parseInt(a.time) - parseInt(b.time);
  });

  const rows = (weekday) => {
    // Place notes in their assigned boxes by day selector
    return sortedNotes.map(note =>
      weekday === note.day ?
      <Note
        key={note.id}
        note={note}
        toggleImportance={() => props.toggleImportanceOf(note)}
        removeNote={() => props.removeNote(note.id)}
      />
      : console.log('next')
    )
  }

  const getCurrentDay = (weekday) => {
    // Select and mark the current day 
    const d = new Date();
    const dayInt = d.getDay() - 1;
    const currDay = daysArray[dayInt];
    const selectCurrDay = weekday === currDay ? 'today' : '';
    return selectCurrDay;
  }

  const days = () => (
    // Create day containers (boxes)
    daysArray.map (weekday =>
      <div className="day-container" key={weekday}>
        <h2 className={getCurrentDay(weekday)}>{weekday}</h2>
        <ul id={weekday}>
          {rows(weekday)}
        </ul>
      </div>
    )
  )

  return(
    <div className="days-container">
      {days()}
    </div>
  )
}

const notesToShow = ({notes, filter}) => {
  // Filtering notes to show
  console.log("kutsutaan sitten")
  if (filter === 'ALL') {
    return notes
  }
  return filter === 'DONE'
    ? notes.filter(note => note.done)
    : notes.filter(note => !note.done)
}

const mapStateToProps = (state) => {
  // Updates the state of visible notes
  console.log("kutsutaan ensin")
  console.log(state);
  return {
    visibleNotes: notesToShow(state),
  }
}

const mapDispatchToProps = {
  toggleImportanceOf,
  removeNote,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)