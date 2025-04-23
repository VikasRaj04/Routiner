import React from "react";
import "./Sidebar.css";
import { ReactComponent as Logo } from '../../logo-white.svg';
import { NavLink, Link } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaUser, FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { FaBarsProgress } from "react-icons/fa6";

const Sidebar = () => {
    const getActiveClass = ({ isActive }) => (isActive ? "active-link" : "");

    const menuItems = [
        { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
        { to: "/progress", icon: <FaBarsProgress />, label: "Progress" },
        { to: "/history", icon: <FaHistory />, label: "History" },
        { to: "/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
        { to: "/profile", icon: <FaUser />, label: "Profile" },
        { to: "/", icon: <FaHome />, label: "Back to Home" },
    ];

    return (
        <aside className="dashboard-sidebar">
            <nav className="sidebar-menu">
                <div className="logo" aria-label="Routiner App">
                    <Link to="/"><Logo /> Routiner</Link>
                </div>
                <ul className="menu-items">
                    {menuItems.map(({ to, icon, label }) => (
                        <li key={to}>
                            <NavLink to={to} className={getActiveClass}>
                                {icon} {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
