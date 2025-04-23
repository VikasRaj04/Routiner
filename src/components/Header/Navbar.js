import React, { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { ReactComponent as Logo } from '../../logo.svg';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        const nav = document.querySelector('.navbar-links');
        nav.classList.toggle('active');
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className='navbar'>
            <div className="logo" aria-label="Routiner App">
                <Link to="/"><Logo /> Routiner</Link>
            </div>

            <ul className='navbar-links'>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active-link" : "")}>Calender</NavLink>
                </li>
                <li>
                    <NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>Profile</NavLink>
                </li>
            </ul>

            <div className="menu-toggle" onClick={toggleMenu}>
                {menuOpen ? '✖' : '☰'}
            </div>

        </nav>
    )
}

export default Navbar
