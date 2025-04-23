import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

const LogoutBtn = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error: ", error.message);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutBtn;
