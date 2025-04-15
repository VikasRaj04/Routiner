import React, { useState } from "react";
import { addNoteToDate } from "../../firebase/firebaseService";


const NoteModal = ({ selectedDate, closeNote, userId }) => {
    const [noteText, setNoteText] = useState(""); // Note ko store karne ka state
    // const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString("en-CA") : "";

    const handleNoteSubmit = async () => {
        if (!noteText.trim()) return; // Agar note empty hai toh kuch na ho


        // Firebase me note add karo
        await addNoteToDate(userId, selectedDate, noteText.trim());

        setNoteText(""); 
        closeNote(); 
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
                <div className="modal-buttons">
                    <button onClick={handleNoteSubmit} className="save-btn">Save</button>
                    <button onClick={closeNote} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;
