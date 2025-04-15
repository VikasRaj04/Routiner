import React from 'react';
import './Habit.css';
import Button from '../Button';

function HabitForm({
  closeModal,
  handleSubmit,
  habitName,
  setHabitName,
  description,
  setDescription,
  category,
  setCategory,
  frequency,
  setFrequency,
  startDate,
  setStartDate,
  markDate,
  setMarkDate,
  action = 'Add Habit'
}) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Habit</h2>

        <div className="close-btn" onClick={closeModal} aria-label="Close">
          &times;
        </div>

        <form onSubmit={handleSubmit}>
          <label>Habit Name:</label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>Frequency:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="1/1">Daily 1</option>
            <option value="2/1">Daily 2</option>
            <option value="3/1">Daily 3</option>
            <option value="1/7">Weekly</option>
          </select>

          {/* Start Date (for future habit scheduling) */}
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* Mark Date (for special calendar dates) */}
          <label>Mark Special Date (e.g. birthday):</label>
          <input
            type="date"
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
          />

          <div className="buttons">
            <Button type="submit">{action}</Button>
            <Button type="button" onClick={closeModal}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitForm;
