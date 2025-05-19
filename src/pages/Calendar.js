import React, { useState, useCallback } from "react";
// import { generateCalendarDates } from "../utils/dateUtils";
import { CalendarWrapper, DateModal, NoticeBoard, Sidebar } from "../components";
import "./styles/Calendar.css";
import Topbar from "../utils/Topbar";
import { FaCalendar } from "react-icons/fa";

const Calendar = () => {
  // const dates = generateCalendarDates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDateClick = useCallback((date) => {
    setClickedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setClickedDate(null);
  }, []);

  return (
    <div className="calendar">
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>
      <main>
        <h1 className="calendar-title"><FaCalendar /> Routiner Calendar </h1>
        <CalendarWrapper onDateClick={handleDateClick} />
        <DateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={clickedDate}
        />

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>
        
        <NoticeBoard />

        <div className="ad">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405064387458435"
            crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-format="fluid"
            data-ad-layout-key="-ef+6k-30-ac+ty"
            data-ad-client="ca-pub-3405064387458435"
            data-ad-slot="5877457995"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
