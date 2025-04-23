import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button, Navbar } from "../components";
import { useNavigate } from "react-router-dom";

import "./styles/Profile.css";
import defaultAvatar from "../images/AboutIllust1.webp";
import getFirebaseErrorMessage from "../firebase/firebaseErrors";

function Profile() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setStatus({ loading: false, error: "User not logged in." });
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

        setUser({
          name: currentUser.displayName || userData.name || "Anonymous User",
          email: currentUser.email,
          uid: currentUser.uid,
          photoURL: currentUser.photoURL || "",
          customId: userData.customId || "Not Set",
          birth: userData.birth || "Not Provided",
          gender: userData.gender || "Not Provided",
        });

        setStatus({ loading: false, error: null });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setStatus({
          loading: false,
          error: getFirebaseErrorMessage(error),
        });
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert(getFirebaseErrorMessage(error));
    }
  };

  const { loading, error } = status;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : error ? (
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <Button onClick={() => navigate("/login")}>Log In</Button>
          </div>
        ) : !user ? (
          <div>
            <h2>Not Logged In</h2>
            <p>Please log in or sign up to access full features.</p>
            <Button onClick={() => navigate("/login")}>Log In</Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        ) : (
          <>
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
                <strong>UID:</strong> {user.customId}
              </div>
              <div className="info-item">
                <strong>Date of Birth:</strong> {user.birth}
              </div>
              <div className="info-item">
                <strong>Gender:</strong> {user.gender}
              </div>
            </div>

            <Button onClick={handleLogout} className="logout-btn">
              Log Out
            </Button>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
