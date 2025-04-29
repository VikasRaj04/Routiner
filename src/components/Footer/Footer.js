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
              <li><a href="/privacy-policy">Privacy & Policy</a></li>
              {/* <li><a href="#" onClick={() => generateUserReport(user.uid)}>Reports</a></li> */}
              {/* <li><a href="/contact">Contact Us</a></li> */}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Routiner. All rights reserved.</p>
        <div className="social-icons">
          <span className="icon">
            <a
              href="https://www.facebook.com/profile.php?id=100041961218628"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </span>
          <span className="icon">
            <a
              href="https://www.x.com/vikasraj04"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </span>
          <span className="icon">
            <a
              href="https://www.instagram.com/vikas_raj_alone?igsh=MTF5bDBsdmV6amVrbQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </span>
          <span className="icon">
            <a
              href="https://www.linkedin.com/in/vikasraj04?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
