import React from "react";
import "./Sidebar.css";
import { ReactComponent as Logo } from '../../logo-white.svg';
import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaUser, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { FaBarsProgress } from "react-icons/fa6";
import { BsBack } from "react-icons/bs";

const Sidebar = () => {
    return (
        <aside className="dashboard-sidebar">
            <nav className="sidebar-menu">

                <div className="logo" aria-label="Routiner App">
                    <Link to="/"><Logo /> Routiner</Link>
                </div>

                <ul className="menu-items">
                    
                    <li>
                        <NavLink to="/dashboard"  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaTachometerAlt /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/progress"  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaBarsProgress /> Progress
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/history"  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaHistory /> History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/calendar"  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaCalendarAlt /> Calendar
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile"  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaUser /> Profile
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to='/'  className={({ isActive }) => (isActive ? "active-link" : "")}>
                            <FaHome /> Back to Home
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
