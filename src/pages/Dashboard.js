import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles/Dashboard.css";
import Sidebar from "../components/Sidebar/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import Overview from "../components/Dashboard/Overview";
import HabitList from "../components/Habits/HabitList";
import EditHabitModal from "../components/Habits/EditHabitModel";
import { closeEditModal } from "../store/slices/habitSlice";
import Topbar from "../utils/Topbar";
// import { Footer } from "../components";

const Dashboard = () => {
  const { editModalOpen, habitToEdit } = useSelector(state => state.habits);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  // const closeSidebar = () => setIsSidebarOpen(false);

  return (

    <div className="dashboard-container">
      <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <main className="dashboard-main">
        {/* Dashboard Header */}
        <div className="header">
          <DashboardHeader />
        </div>

        {/* Overview Section */}
        <div className="overview">
          <Overview />
        </div>

        {/* Habit Section */}
        <div className="habit-section-main">
          {/* Conditionally render EditHabitModal if open */}
          {editModalOpen && (
            <EditHabitModal closeModal={() => dispatch(closeEditModal())} habit={habitToEdit} />
          )}

          <HabitList />
          
        </div>
      {/* <Footer /> */}
      </main>
    </div>
  );
};

export default Dashboard;
