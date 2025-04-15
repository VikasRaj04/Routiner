import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewHabit } from "../../store/slices/habitSlice";
import "./Habit.css";
import HabitForm from "./HabitForm";
import { addHistoryEntry } from "../../firebase/firebaseService";

const AddHabitModal = ({ closeModal }) => {
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [frequency, setFrequency] = useState("1/1");
  const [startDate, setStartDate] = useState("");  // Define startDate state
  const [markDate, setMarkDate] = useState("");    // Define markDate state

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!habitName.trim()) {
      alert("Habit Name is required!");
      return;
    }

    const newHabit = {
      name: habitName,
      description,
      category,
      frequency,
      startDate,
      markDate,
    };

    if (userId) {
      // Dispatch habit add action and wait for Firebase to return the ID
      const resultAction = await dispatch(addNewHabit({ userID: userId, habitData: newHabit }));

      const habitId = resultAction?.payload?.id; // ID from Firebase response (if returned)
      const isGuest = userId.startsWith("guest_");

      if (!isGuest && habitId) {
        await addHistoryEntry(userId, {
          habitId,
          action: "created",
          timestamp: new Date().toISOString(),
          habitName,
        });
        console.log(habitId, "History Habit Created ")
      }
    }

    closeModal();
  };

  return (
    <HabitForm
      closeModal={closeModal}
      handleSubmit={handleSubmit}
      habitName={habitName}
      setHabitName={setHabitName}
      description={description}
      setDescription={setDescription}
      category={category}
      setCategory={setCategory}
      frequency={frequency}
      setFrequency={setFrequency}
      startDate={startDate}      // Pass startDate to HabitForm
      setStartDate={setStartDate}  // Pass setStartDate to HabitForm
      markDate={markDate}        // Pass markDate to HabitForm
      setMarkDate={setMarkDate}  // Pass setMarkDate to HabitForm
      action="Add Habit"
    />
  );
};

export default AddHabitModal;
