import React from 'react';
import { NavLink, Link } from 'react-router';
import { ReactComponent as Logo } from '../../logo.svg';
import "./Navbar.css";

function Navbar() {
    return (
        <nav className='navbar'>
            <div className="logo" aria-label="Routiner App">
                <Link to="/"><Logo /> Routiner</Link>
            </div>

            <ul className='navbar-links'>
                <li>
                    <NavLink to="/"  className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard"  className={({ isActive }) => (isActive ? "active-link" : "")}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/calendar"  className={({ isActive }) => (isActive ? "active-link" : "")}>Calender</NavLink>
                </li>
                <li>
                    <NavLink to="/profile"  className={({ isActive }) => (isActive ? "active-link" : "")}>Profile</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
