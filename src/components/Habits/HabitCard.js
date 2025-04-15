import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Habit.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Button from "../Button";
import { openEditModal } from "../../store/slices/habitSlice";

function HabitCard({ habit, handleDelete }) {
  const dispatch = useDispatch();
  const progress = useSelector((state) => state.progress.fullProgress);

  // 🧠 Get matched progress using habit.id as key
  const matchedProgress = useMemo(() => {
    if (!progress || !habit?.id) return null;
    return progress[habit.id] || null;
  }, [progress, habit.id]);

  const matchedStreak = matchedProgress?.maxStreak || 0;

  // ⚙️ Handlers
  const handleEditClick = useCallback(() => {
    dispatch(openEditModal(habit));
  }, [dispatch, habit]);

  const handleDeleteClick = useCallback(() => {
    handleDelete(habit?.id, habit?.name);
  }, [handleDelete, habit]);

  return (
    <div className="habit-card">
      <div className="habit-card-content">
        <div className="habit-name-descript">
          <h3 className="habit-name">{habit?.name || "Untitled Habit"}</h3>
          <p className="description">{habit?.description || "No Description"}</p>
        </div>

        <div className="habit-freq-streak">
          {habit?.category && (
            <p>
              <span>Category:</span> {habit.category}
            </p>
          )}
          <p>
            <span>Frequency:</span> {habit?.frequency || "Not Set"}
          </p>
          <p>
            <span>Streaks:</span>{" "}
            {matchedStreak > 0 ? `${matchedStreak} Days` : "No Streaks"}
          </p>
        </div>
      </div>

      <div className="habit-action-btn">
        <div className="delete">
          <Button
            className="delete-button"
            onClick={handleDeleteClick}
            aria-label="Delete Habit"
          >
            <FaTrashAlt />
          </Button>
          <span>Delete</span>
        </div>

        <div className="edit">
          <Button
            className="edit-button"
            onClick={handleEditClick}
            aria-label="Edit Habit"
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
