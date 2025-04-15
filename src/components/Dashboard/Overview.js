import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectDashboard, setDashboardData } from "../../store/slices/DashboardSlice";
import { selectUser, selectUserId } from "../../store/slices/AuthSlice"; // ✅ User selector added
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./CompoDashboard.css";
import { Button, Graph } from "../index";
import AddHabit from "../Habits/AddHabit";
import { FaPersonArrowUpFromLine } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { generateUserReport } from "../../utils/generateUserReport";


const Overview = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalHabits = useSelector((state) => state.habits.totalHabits.length) || 0;
  const completionRate = useSelector((state) => state.progress.overallAverage) || 0;
  const bestHabit = useSelector(state => state.progress.bestHabit?.name || "N/A");
  const missedHabit = useSelector(state => state.progress.missedHabit?.name || "N/A");
  const longestStreakHabit = useSelector(state => state.progress.longestStreakHabit);
  const currentStreak = longestStreakHabit?.streak || 0;
  const futureHabits = useSelector((state) => state.habits.futureHabits);

  const user = useSelector(selectUser); // ✅ Authenticated user
  // const userId = useSelector(selectUserId);

  // 📌 Firestore से habits fetch करना (Logged-in user के लिए)
  useEffect(() => {
    const fetchHabits = async () => {
      if (!user?.uid) return; // ✅ Agar user logged in nahi hai toh return kar do

      try {
        const habitsCollection = collection(db, `users/${user.uid}/habits`); // ✅ Correct Firestore path
        const habitsSnapshot = await getDocs(habitsCollection);
        const habits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 📌 Streak और Completion Rate calculate करना
        const streak = calculateCurrentStreak(habits);
        const rate = calculateCompletionRate(habits);

        dispatch(setDashboardData({
          totalHabits: habits.length,
          currentStreak: streak,
          completionRate: rate,
          bestHabit: habits.length > 0 ? habits[0].name : "N/A",
          missedHabit: habits.length > 1 ? habits[1].name : "N/A"
        }));

      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, [user, dispatch, totalHabits, currentStreak, completionRate]); // ✅ User change hone par re-fetch karega

  // 📌 🔥 Current Streak Calculate करने का Logic
  const calculateCurrentStreak = (habits) => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];

    habits.forEach(habit => {
      const completedDates = habit.completedDates || [];
      let tempStreak = 0;
      let yesterday = new Date(today);

      // लगातार completed dates check करो
      for (let i = completedDates.length - 1; i >= 0; i--) {
        const date = new Date(completedDates[i]);
        if (date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          tempStreak++;
          yesterday.setDate(yesterday.getDate() - 1);
        } else {
          break;
        }
      }

      streak = Math.max(streak, tempStreak);
    });

    return streak;
  };

  // 📌 🔥 Completion Rate Calculate करने का Logic
  const calculateCompletionRate = (habits) => {
    let completedDays = 0;
    let totalDaysTracked = 0;

    habits.forEach(habit => {
      const completedDates = habit.completedDates || [];
      completedDays += completedDates.length;
      totalDaysTracked += habit.trackedDays || 0;  // अगर trackedDays नहीं है तो 0 मानेंगे
    });

    return totalDaysTracked > 0 ? ((completedDays / totalDaysTracked) * 100).toFixed(2) : 0;
  };

  return (
    <div className="dashboard-overview">
      <section className="key-metrics">
        <div className="metric-card">Total Habits: {totalHabits}</div>
        <div className="metric-card">Current Streak: {currentStreak} days</div>
        <div className="metric-card">Upcoming Habits: {futureHabits.length}</div>
      </section>

      <section>
        <Graph />
      </section>

      <section className="highlights-actions">
        <div className="highlights">
          <p><span>Best Habit:</span> {bestHabit || "N/A"}</p>
          <p><span>Missed Habit:</span> {missedHabit || "N/A"}</p>
        </div>

        <div className="actions">
          <Button className="dash-act-btn add-habit" onClick={() => setIsModalOpen(true)}>
            <FaPersonArrowUpFromLine /> Add New Habit
          </Button>
          {isModalOpen && <AddHabit closeModal={() => setIsModalOpen(false)} />}

          <Button className="dash-act-btn">
            <Link to="/calendar">Calendar</Link>
          </Button>

          <Button className="dash-act-btn" onClick={() => generateUserReport(user.uid)}>
            Generate Report
          </Button>

        </div>
      </section>
    </div>
  );
};

export default Overview;
