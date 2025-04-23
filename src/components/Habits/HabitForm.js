import React from "react";
import "./Habit.css";
import Button from "../Button";

function HabitForm({
  closeModal,
  handleSubmit,
  habitName = "",
  setHabitName,
  description = "",
  setDescription,
  category = "",
  setCategory,
  frequency = "1/1",
  setFrequency,
  startDate = "",
  setStartDate,
  markDate = "",
  setMarkDate,
  action = "Add Habit",
}) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{action}</h2>

        <button className="close-btn" onClick={closeModal} aria-label="Close Modal">
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <label htmlFor="habitName">Habit Name:</label>
          <input
            id="habitName"
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="category">Category:</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="1/1">Daily 1</option>
            <option value="2/1">Daily 2</option>
            <option value="3/1">Daily 3</option>
            <option value="1/7">Weekly</option>
          </select>

          <label htmlFor="startDate">Start Date:</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label htmlFor="markDate">Mark Special Date (e.g. birthday):</label>
          <input
            id="markDate"
            type="date"
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
          />

          <div className="buttons">
            <Button type="submit">{action}</Button>
            <Button type="button" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitForm;
