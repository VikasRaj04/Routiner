import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyHabit, closeEditModal } from "../../store/slices/habitSlice";
import "./Habit.css";
import HabitForm from "./HabitForm";

const EditHabitModal = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.habits.userInfo?.uid);
  const habitToEdit = useSelector((state) => state.habits.habitToEdit);

  // Setting state based on the selected habit to edit
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [markDate, setMarkDate] = useState("");

  useEffect(() => {
    if (habitToEdit) {
      setHabitName(habitToEdit.name);
      setDescription(habitToEdit.description);
      setCategory(habitToEdit.category);
      setFrequency(habitToEdit.frequency);
      setStartDate(habitToEdit.startDate);
      setMarkDate(habitToEdit.markDate);
    }
  }, [habitToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return alert("Habit Name is required!");

    const updatedData = { name: habitName, description, category, frequency, markDate, startDate };
    const oldData = {
      name: habitToEdit.name,
      description: habitToEdit.description,
      category: habitToEdit.category,
      frequency: habitToEdit.frequency,
      markDate: habitToEdit.markDate || "",
      startDate: habitToEdit.startDate,
    };

    if (userId) {
      try {
        const result = await dispatch(
          modifyHabit({ userID: userId, habitID: habitToEdit.id, updatedData, oldData })
        ).unwrap();

        if (result) {
          dispatch(closeEditModal()); // Close modal if successful
        } else {
          alert("Failed to update habit. Please try again.");
        }
      } catch (error) {
        console.error("Error updating habit:", error);
        alert("An error occurred while updating the habit.");
      }
    }
  };

  return (
    <HabitForm
      closeModal={() => dispatch(closeEditModal())}
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
