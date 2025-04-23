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
  const [startDate, setStartDate] = useState("");
  const [markDate, setMarkDate] = useState("");

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName || habitName.trim() === "") {
      console.warn("habitName is required!");
      return alert("Habit Name is required!");
    }

    const newHabit = {
      name : habitName, // Make sure to use habitName here
      description,
      category,
      frequency,
      startDate,
      markDate,
    };

    if (userId) {
      const result = await dispatch(addNewHabit({ userID: userId, habitData: newHabit }));
      const habitId = result?.payload?.id; // Get habitId from the action result
      const isGuest = userId.startsWith("guest_");

      if (!isGuest && habitId) {
        await addHistoryEntry(userId, "Created", habitId, habitName); // Pass habitName as expected
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
      action="Add Habit"
    />
  );
};

export default AddHabitModal;
