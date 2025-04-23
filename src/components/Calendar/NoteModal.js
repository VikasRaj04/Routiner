import React, { useState } from "react";
import { addNoteToDate } from "../../firebase/firebaseService";

const NoteModal = ({ selectedDate, closeNote, userId }) => {
    const [noteText, setNoteText] = useState(""); // Note state
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const handleNoteSubmit = async () => {
        if (!noteText.trim()) {
            setError("Note cannot be empty!"); // Show error message if note is empty
            return;
        }

        setLoading(true); // Set loading state to true before submitting
        try {
            // Add note to Firebase
            await addNoteToDate(userId, selectedDate, noteText.trim());
            setNoteText(""); // Clear the note text after successful submission
            closeNote(); // Close the modal
        } catch (err) {
            console.error("Error saving note:", err);
            setError("Failed to save note. Please try again later."); // Show error if there's an issue with Firebase
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={closeNote} className="close-btn">X</button>
                <h2>Write Your Quick Note 🗒️</h2>
                <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write anything important for today..."
                    rows={5}
                    className="note-textarea"
                />
                {error && <p className="error-message">{error}</p>} {/* Display error message if there is one */}
                <div className="modal-buttons">
                    <button onClick={handleNoteSubmit} className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={closeNote} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
