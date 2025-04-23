// components/Topbar.jsx
import { FaBars, FaTimes } from "react-icons/fa";

export default function Topbar({ toggleSidebar , isSidebarOpen}) {

  return (
    <div className="topbar">
      <button className="hamburger" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars /> }
      </button>
      <span className="logo">Routiner</span>
    </div>
  );
}
