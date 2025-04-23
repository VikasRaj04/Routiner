import React from "react";
// import { generateUserReport } from "../../utils/generateUserReport";
// import { selectUser } from "../../store/slices/AuthSlice";
// import { useSelector } from "react-redux";

const Footer = () => {
  // const user = useSelector(selectUser);
  return (

    <footer className="footer">
      <div className="footer-content">
        <div className="left-footer">
          <h3>Routiner</h3>
          <p>
            Routiner is your productivity partner, helping you track habits,
            stay motivated, and achieve your personal and professional goals
            with ease.
          </p>
          <p>
            Contact us:{" "}
            <a href="mailto:vikas.coder04@gmail.com">
              vikas.coder04@gmail.com
            </a>
          </p>
        </div>

        <div className="right-footer">
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="#about">About</a></li>
              {/* <li><a href="#" onClick={() => generateUserReport(user.uid)}>Reports</a></li> */}
              {/* <li><a href="/contact">Contact Us</a></li> */}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Routiner. All rights reserved.</p>
        <div className="social-icons">
          <span className="icon"><i className="fab fa-facebook-f"></i></span>
          <span className="icon"><i className="fab fa-twitter"></i></span>
          <span className="icon"><i className="fab fa-instagram"></i></span>
          <span className="icon"><i className="fab fa-linkedin-in"></i></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
