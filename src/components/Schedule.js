'use client';
import React, { useState } from "react";

// Helper function to generate calendar days dynamically
const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push("");
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const days = generateCalendarDays(currentYear, currentMonth);

  return (
    <div>
      {/* Inline CSS */}
      <style>{`
        .calendar {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          background-color: #e3f2fd; /* Light blue background for the calendar */
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .calendarHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #bbdefb; /* Slightly darker blue for header */
        }
        .calendarHeader h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #0d47a1; /* Darker text color for contrast */
        }
        .arrow {
          background-color: transparent;
          border: none;
          font-size: 1.5rem;
          color: #0d47a1; /* Darker text color for arrows */
          cursor: pointer;
        }
        .daysOfWeek {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background-color: #b0bec5; /* Grey background for days of week */
        }
        .dayOfWeek {
          text-align: center;
          padding: 10px;
          font-weight: bold;
          color: #fff; /* White text for better contrast */
        }
        .calendarDays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .calendarDay {
          padding: 20px;
          text-align: center;
          background-color: white; /* White background for days */
          border: 1px solid black; /* Black border for days */
          transition: background-color 0.3s; /* Smooth background color transition */
          color: black; /* Black text for day numbers */
          box-sizing: border-box; /* Ensures padding doesn't affect total width */
        }
        .calendarDay.empty {
          background-color: #f9f9f9; /* Light background for empty days */
          border: 1px solid black; /* Keep border on empty days */
        }
        .calendarDay:hover {
          background-color: #81d4fa; /* Light blue on hover */
          cursor: pointer;
        }
      `}</style>

      <div className="calendar">
        <div className="calendarHeader">
          <button onClick={goToPreviousMonth} className="arrow">{"<"}</button>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={goToNextMonth} className="arrow">{">"}</button>
        </div>

        <div className="daysOfWeek">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="dayOfWeek">{day}</div>
          ))}
        </div>

        <div className="calendarDays">
          {days.map((day, index) => (
            <div key={index} className={`calendarDay ${day === "" ? "empty" : ""}`}>
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;