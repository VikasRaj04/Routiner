import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../../store/slices/DashboardSlice";
import HabitCard from "./HabitCard";
import "./Habit.css";
import { Button } from "../index";
import { removeHabit, fetchUserHabits } from "../../store/slices/habitSlice";
import AddHabit from "../Habits/AddHabit";
import { addHistoryEntry, deleteHabitWithProgress, getUserInfo } from "../../firebase/firebaseService";

const HabitList = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentPage, itemsPerPage } = useSelector((state) => state.dashboard);
  const habits = useSelector((state) => state.habits.habits) || [];
  const [userId, setUserId] = useState(null);
  const loading = useSelector((state) => state.habits.loading);

  // 🧠 Fetch user ID
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      const user = await getUserInfo();
      if (user && isMounted) {
        setUserId(user.uid);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // 🧠 Fetch habits from Firebase
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserHabits(userId));
    }
  }, [dispatch, userId]);

  // ✅ Filter habits that are valid or have no startDate
  const filteredHabits = habits.filter((habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // No startDate field OR empty string/null
    if (!habit.hasOwnProperty("startDate") || !habit.startDate) {
      return true;
    }

    const startDateObj = new Date(habit.startDate);
    startDateObj.setHours(0, 0, 0, 0);

    // Only include if start date is today or earlier
    return !isNaN(startDateObj.getTime()) && startDateObj <= today;
  });

  // 📄 Pagination logic (based on filtered habits)
  const totalPages = Math.ceil(filteredHabits.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHabits = filteredHabits.slice(indexOfFirstItem, indexOfLastItem);

  // 🗑️ Handle delete
  const handleDelete = async (habitId, habitName) => {
    if (!userId) {
      alert("User not found. Please try again.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${habitName}"?`)) {
      try {
        await deleteHabitWithProgress(userId, habitId);
        await dispatch(removeHabit({ userID: userId, habitID: habitId, habitName })).unwrap();
        await addHistoryEntry(userId, "deleted", habitId, habitName);
        alert("Habit deleted successfully!");
      } catch (error) {
        console.error("Failed to delete habit:", error);
        alert("Failed to delete habit. Please try again.");
      }
    }
  };

  // ⏳ Show loading while fetching habits
  if (loading) return <p></p>;

  return (
    <section className="habit-list-section">
      <div>
        <h2 className="habitlist-heading">Habit List</h2>
      </div>

      <div className="habit-list">
        {filteredHabits.length > 0 ? (
          currentHabits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} handleDelete={handleDelete} />
          ))
        ) : (
          <div className="no-habits-card">
            <p>No habits found! Start tracking your habits now.</p>
            <Button className="add-habit-btn" onClick={() => setIsModalOpen(true)}>
              Add New Habit
            </Button>
            {isModalOpen && <AddHabit closeModal={() => setIsModalOpen(false)} />}
          </div>
        )}
      </div>

      {/* 📄 Pagination */}
      {filteredHabits.length > 0 && (
        <div className="pagination">
          <Button onClick={handlePrevPage} aria-disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} aria-disabled={currentPage >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </section>
  );

  // 📲 Pagination handlers
  function handleNextPage() {
    if (currentPage < totalPages) dispatch(setCurrentPage(currentPage + 1));
  }

  function handlePrevPage() {
    if (currentPage > 1) dispatch(setCurrentPage(currentPage - 1));
  }
};

export default HabitList;
