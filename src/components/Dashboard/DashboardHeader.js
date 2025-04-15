import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { setUserInfo } from "../../store/slices/habitSlice";

function DashboardHeader() {
  const dispatch = useDispatch();

  // 🔹 Redux Store
  const allHabits = useSelector((state) => state.habits.habits) || [];
  const reduxUser = useSelector((state) => state.habits.userInfo) || null;
  const todayCompletedHabits = useSelector((state) => state.progress.todayCompletedHabits) || 0;

  // 🔹 Local user state
  const [user, setUser] = useState({ name: "Anonymous" });

  const totalHabits = allHabits.length;

  // 🔹 Fetch user info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setUser({ name: reduxUser?.name || "Anonymous" });
          return;
        }

        let userData = {
          name: currentUser.displayName || reduxUser?.name || "User",
        };

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          userData = { uid: currentUser.uid, ...userDoc.data() };
          dispatch(setUserInfo(userData));
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser({ name: "User" });
      }
    };

    fetchUserData();
  }, [reduxUser, dispatch]);

  // 🔹 Format today's date (for display)
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h2>Hi, Welcome Back {user.name}!</h2>
        <p>{currentDate}</p>
        <p>
          You have completed {todayCompletedHabits} out of {totalHabits} habits today.
        </p>
      </div>
    </header>
  );
}

export default DashboardHeader;
