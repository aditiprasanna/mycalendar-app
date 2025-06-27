import React from'react';
import { useState } from 'react';

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [reminders, setReminders] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year,month,1).getDay();
  const today = new Date();
  const todayMonth = today.getMonth() ===month && today.getFullYear()===year;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleAddReminder = () => {
    if (selectedDay && inputValue.trim() !== "") {
      const newReminders = { ...reminders };
      newReminders[selectedDay] = inputValue.trim();
      setReminders(newReminders);
      setSelectedDay(null);
      setInputValue("");
    }
  }

    const handleDeleteReminder = () => {
    const newReminders = { ...reminders };
    delete newReminders[selectedDay];
    setReminders(newReminders);
    setSelectedDay(null);
    setInputValue("");
  }

  const handleCancel = () => {
    setSelectedDay(null);
    setInputValue("");
  }

  const goToToday = () => setDate(new Date());
  const goToNextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  const goToPreviousMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));

  const calendarCells = [];

  dayNames.forEach((day, i) => {
    calendarCells.push(
      <div key={"day" + i} style={styles.dayName}>{day}</div>
    )
  })

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={"empty" + i} style={styles.dataCell}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = todayMonth && today.getDate() === day;
    const key = `${year}-${month}-${day}`;
    const rem = reminders[key];

    calendarCells.push(
      <div key={day}
        style={{
          ...styles.dataCell,
          ...(isToday ? styles.todayCell : {}),
          flexDirection: "column",
        }}
        onClick={() => {
          setSelectedDay(key);
          setInputValue(reminders[key] || "");
        }}  >
        <div style={{ fontWeight: "bold", cursor: "pointer" }}>{day}</div>
      {rem && (
  <div
    style={styles.text}
    onMouseEnter={() => {
      const id = setTimeout(() => {
        setDialogText(rem);
        setDialogOpen(true);
      }, 1500); 
      setTimerId(id); 
    }}
    onMouseLeave={() => {
      clearTimeout(timerId); 
    }}
  >
    {rem}
  </div>
)}
      </div>
    )
  }

  const remaining = calendarCells.length % 7 === 0 ? 0 : 7 - (calendarCells.length % 7);
  for (let i = 0; i < remaining; i++) {
    calendarCells.push(<div key={"filler" + i} style={styles.dataCell}></div>);
  }

  return (
    <div style={{ textAlign: "center", padding: "10px", marginBottom: "10px" }}>

      <h1 style={{ marginTop: "10px", marginBottom: "5px" }}>
        {monthNames[month]} {year}
      </h1>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={goToPreviousMonth} style={{ marginRight: "10px" }}>Previous</button>
        <button onClick={goToToday} style={{ marginRight: "10px" }}>Today</button>
        <button onClick={goToNextMonth}>Next</button>
      </div>

      <div style={styles.grid}>{calendarCells}</div>

      {selectedDay && (
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ marginBottom: "10px" }}>Reminder</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter reminder"
            style={{ width: "200px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleAddReminder} style={{ marginRight: "10px" }}>Add</button>
            <button onClick={handleDeleteReminder} style={{ marginRight: "10px" }}>Delete</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div
          style={styles.dialogOverlay}
          onMouseLeave={() => setDialogOpen(false)} >
          <div style={styles.dialogBox}>
            <h3 style={{ marginBottom: "15px" }}>Reminder</h3>
            <p style={{ marginBottom: "20px", wordWrap: "break-word" }}>{dialogText}</p>
            <button
              onClick={() => setDialogOpen(false)}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                backgroundColor: "Blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}> Close </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    maxWidth: "400px",
    margin: "auto",
  },
  dayName: {
    backgroundColor: "lightBlue",
    fontWeight: "bold",
    color: "grey",
    border: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "50px",
  },
  dataCell: {
    backgroundColor: "lightCyan",
    color: "grey",
    border: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "60px",
    flexDirection: "column",
    overflow: "hidden",
    padding: "2px",
  },
  todayCell: {
    backgroundColor: "blue",
    color: "black",
    fontWeight: "bold",
    border: "1px solid black",
  },
  text: {
    fontSize: "10px",
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "80%",
    cursor: "pointer",
    padding: "2px",
    borderRadius: "5px",
  },
  dialogOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "transparent",  
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
},
 dialogBox: {
  backgroundColor: "white",         
  padding: "30px",
  border: "1px solid gray",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px black",  
  textAlign: "center",
  minWidth: "300px",
  maxWidth: "400px",
  color: "black"
}
}

export default Calendar;
