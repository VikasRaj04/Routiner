import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { openEditModal } from "../../store/slices/habitSlice";
import Button from "../Button";
import "./Habit.css";

function HabitCard({ habit, handleDelete }) {
  const dispatch = useDispatch();
  const progress = useSelector((state) => state.progress.fullProgress);

  const matchedProgress = useMemo(() => {
    return progress?.[habit.id] || null;
  }, [progress, habit.id]);

  const matchedStreak = matchedProgress?.maxStreak || 0;

  const handleEditClick = useCallback(() => {
    dispatch(openEditModal(habit)); // Dispatching habit to Redux for editing
  }, [dispatch, habit]);

  const handleDeleteClick = useCallback(() => {
    handleDelete(habit.id, habit.name);
  }, [handleDelete, habit]);

  return (
    <div className="habit-card">
      <div className="habit-card-content">
        <div className="habit-name-descript">
          <h3 className="habit-name">{habit.name || "Untitled Habit"}</h3>
          <p className="description">{habit.description || "No Description"}</p>
        </div>

        <div className="habit-freq-streak">
          {habit.category && (
            <p>
              <span>Category:</span> {habit.category}
            </p>
          )}
          <p>
            <span>Frequency:</span> {habit.frequency || "Not Set"}
          </p>
          <p>
            <span>Streaks:</span> {matchedStreak > 0 ? `${matchedStreak} Days` : "No Streaks"}
          </p>
        </div>
      </div>

      <div className="habit-action-btn">
        <div className="delete">
          <Button
            className="delete-button"
            onClick={handleDeleteClick}
            aria-label={`Delete habit ${habit.name}`}
          >
            <FaTrashAlt />
          </Button>
          <span>Delete</span>
        </div>

        <div className="edit">
          <Button
            className="edit-button"
            onClick={handleEditClick}
            aria-label={`Edit habit ${habit.name}`}
          >
            <FaEdit />
          </Button>
          <span>Edit</span>
        </div>
      </div>
    </div>
  );
}

export default HabitCard;
