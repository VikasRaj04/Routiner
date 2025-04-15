import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyHabit } from "../../store/slices/habitSlice";
import "./Habit.css";
import HabitForm from "./HabitForm";

const EditHabitModal = ({ habit, closeModal }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.habits.userInfo?.uid);

  // 🟢 Initial State: old habit data se prefill
  const [habitName, setHabitName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [category, setCategory] = useState(habit.category);
  const [frequency, setFrequency] = useState(habit.frequency);
  const [startDate, setStartDate] = useState(habit.startDate);
  const [markDate, setMarkDate] = useState(habit.markDate);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!habitName.trim()) {
      alert("Habit Name is required!");
      return;
    }

    // 🟢 New Updated Data
    const updatedData = { name: habitName, description, category, frequency, markDate, startDate };

    // 🟢 Old Data (for history tracking)
    const oldData = { name: habit.name, description: habit.description, category: habit.category, frequency: habit.frequency, markDate: habit?.markDate || "", startDate: habit.startDate };

    if (userId) {
      const result = await dispatch(
        modifyHabit({ userID: userId, habitID: habit.id, updatedData, oldData }) // 🔥 oldData pass karo
      ).unwrap();

      if (result) {
        closeModal();
      } else {
        alert("Failed to update habit. Please try again.");
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
      startDate={startDate}
      setStartDate={setStartDate}
      markDate={markDate}
      setMarkDate={setMarkDate}
      action="Update Habit"
    />
  );
};

export default EditHabitModal;
