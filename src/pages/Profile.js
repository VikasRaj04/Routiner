import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button, Navbar } from "../components";
import { useNavigate } from "react-router-dom";
import "./styles/Profile.css";
import defaultAvatar from "../images/AboutIllust1.webp";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        let userData = {
          name: currentUser.displayName || "Anonymous User",
          email: currentUser.email,
          birth: currentUser.birth || "Not Provided", // Handle missing birth date
          uid: currentUser.uid,
          photoURL: currentUser.photoURL,
        };

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          userData = { ...userData, ...userDoc.data() };
        }

        setUser(userData);
      } catch (fetchError) {
        console.error("Error fetching user data:", fetchError);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("Logged out successfully!");
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Error during logout. Please try again.");
    }
  };

  if (loading) {
    return <p className="loading">Loading profile...</p>; // Add more specific loading indicator
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={() => navigate("/login")}>Log In</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Not Logged In</h2>
        <p>Please log in or sign up to access full features.</p>
        <Button onClick={() => navigate("/login")}>Log In</Button>
        <Button onClick={() => navigate("/signup")}>Sign Up</Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={user.photoURL || defaultAvatar}
            alt="Profile"
            className="profile-avatar"
          />
          <h1 className="user-name">{user.name}</h1>
          <p className="email">{user.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <strong>UID:</strong> {user.customId || "Not Set"}
          </div>
          <div className="info-item">
            <strong>Date of Birth:</strong> {user.birth}
          </div>
          <div className="info-item">
            <strong>Gender:</strong> {user.gender || "Not Provided"}
          </div>
        </div>

        <Button onClick={handleLogout} className="logout-btn">
          Log Out
        </Button>
      </div>
    </>
  );
}

export default Profile;
