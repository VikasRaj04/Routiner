import React, { useState } from "react";
import { generateCalendarDates } from "../utils/dateUtils";
import { CalendarGrid, CalendarWrapper, DateModal, NoticeBoard, Sidebar } from "../components";
import "./styles/Calendar.css";

const Calendar = () => {
  const dates = generateCalendarDates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);

  const handleDateClick = (date) => {
    setClickedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClickedDate(null);
  };

  return (
    <div className="calendar">
      <Sidebar />
      <main>
        <h1 className="calendar-title">📅 Calendar View</h1>
        {/* <CalendarGrid dates={dates} onDateClick={handleDateClick} /> */}
        <CalendarWrapper onDateClick={handleDateClick} />
        <DateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={clickedDate}
        />

        <NoticeBoard />
      </main>
    </div>
  );
};

export default Calendar;
