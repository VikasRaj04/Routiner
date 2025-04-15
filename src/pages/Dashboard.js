import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles/Dashboard.css";
import Sidebar from "../components/Sidebar/Sidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import Overview from "../components/Dashboard/Overview";
import HabitList from "../components/Habits/HabitList";
import EditHabitModal from "../components/Habits/EditHabitModel";
import { closeEditModal } from "../store/slices/habitSlice";

const Dashboard = () => {
  

  const { habits, editModalOpen, habitToEdit } = useSelector(state => state.habits);
  const dispatch = useDispatch();

  return (
    <div className="dashboard-container">

      <Sidebar />

      <main className="dashboard-main">
        <div className="header">
          <DashboardHeader />
        </div>

        <div className="overview">
          <Overview />
        </div>


        <div className="habit-section-main">
          

        {editModalOpen ? <EditHabitModal closeModal={() => dispatch(closeEditModal())} habit={habitToEdit} /> : null}


          <HabitList />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;


