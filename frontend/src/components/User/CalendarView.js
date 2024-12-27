import React, { useState } from 'react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  return (
    <div>
      <h2>Calendar View</h2>
      <div>
        <button onClick={handlePrevMonth}>Previous</button>
        <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div>
        {/* You can expand this to display days of the month */}
        <p>{currentDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CalendarView;
