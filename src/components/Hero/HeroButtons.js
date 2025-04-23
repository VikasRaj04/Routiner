import React, { useEffect } from 'react';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleAuthProvider, signInAnonymously, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

function HeroButtons() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isGuest = useSelector((state) => state.auth.isGuest);

  // Page Loaded and Redirects
  useEffect(() => {
    const firstVisitChecked = localStorage.getItem('firstVisitChecked');

    if (!firstVisitChecked) {
      if (isLoggedIn || isGuest) {
        navigate('/dashboard');
        return;
      }

      const isFirstVisit = localStorage.getItem('isFirstVisit');
      if (isFirstVisit === null) {
        localStorage.setItem('isFirstVisit', 'false');
      } else {
        navigate('/dashboard');
      }

      localStorage.setItem('firstVisitChecked', 'true');
    }
  }, [isLoggedIn, isGuest, navigate]);

  // Login Page
  const handleEmailLogin = () => navigate('/login');

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error with Google login:', err.message);
    }
  };

  // Guest Login
  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error logging in as guest:', err.message);
    }
  };

  return (
    <div>
      <div className="btns">
        <Button className="white-btn hero-btn-main" onClick={handleEmailLogin}>
          <i className="fa-solid fa-arrow-right-to-bracket" /> Continue with E-mail
        </Button>
        <div className="social-buttons">
          <Button className="social-btn white-btn" onClick={handleGoogleLogin}>
            <i className="fa-brands fa-google" /> Google
          </Button>

          {/* <Button className="social-btn white-btn">
            <i className="fa-brands fa-facebook" /> Facebook
          </Button> */}

          <Button className="social-btn white-btn" onClick={handleGuestLogin}>
            Guest
          </Button>
        </div>
      </div>
      <p className="privacy-policy">
        By continuing you agree Terms of Services & Privacy Policy
      </p>
    </div>
  );
}

export default HeroButtons;
