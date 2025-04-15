import React, { useEffect, useState } from 'react';
import { fetchNotes, modifyNote, deleteNote } from '../../firebase/firebaseService'; // Import new functions
import { useSelector } from 'react-redux';

const NoticeBoard = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle error state
    const [editNoteId, setEditNoteId] = useState(null); // State to track note being edited
    const [editedNoteText, setEditedNoteText] = useState(""); // State to track edited note content
    const userId = useSelector(state => state.auth.userId);

    const randomColor = () => {
        const colors = [
            'note-blue', 'note-yellow', 'note-beige', 'note-peach', 'note-green', 'note-pink',
            'note-lavender', 'note-mint', 'note-rose', 'note-sky', 'note-sand', 'note-cream'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const getNotes = async (userId) => {
            try {
                setLoading(true);  // Set loading true before fetching
                const notesData = await fetchNotes(userId);
                setNotes(notesData);
                setLoading(false);  // Set loading false when data is fetched
            } catch (error) {
                console.error("Error fetching notes: ", error);
                setError("Failed to load notes. Please try again later.");
                setLoading(false);  // Set loading false in case of error
            }
        };

        if (userId) {
            getNotes(userId);
        }
    }, [userId]);

    const handleEditNote = (noteId, currentText) => {
        setEditNoteId(noteId);
        setEditedNoteText(currentText);
    };

    const handleSaveEditedNote = async () => {
        if (!editedNoteText.trim()) return; // If note is empty, do nothing
        try {
            await modifyNote(userId, editNoteId, editedNoteText.trim()); // Call Firebase function to modify note
            setEditNoteId(null); // Reset edit state
            setEditedNoteText(""); // Reset input field
            setNotes(await fetchNotes(userId)); // Fetch updated notes
        } catch (error) {
            console.error("Error saving edited note:", error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(userId, noteId); // Call Firebase function to delete note
            setNotes(await fetchNotes(userId)); // Fetch updated notes
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading Notes...</p>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;  // Display error message if an error occurs
    }

    return (
        <div className="noticeboard">
            <h2 className="noticeboard-title">Notice Board</h2>
            {notes.length === 0 ? (
                <p>No notes available</p>
            ) : (
                <div className="sticky-notes-container">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`sticky-note ${randomColor()}`}
                        >
                            {editNoteId === note.id ? (
                                <div>
                                    <textarea
                                        className='edit-textarea'
                                        value={editedNoteText}
                                        onChange={(e) => setEditedNoteText(e.target.value)}
                                        rows={5}
                                        placeholder="Edit your note..."
                                    />
                                    <div className="edit-buttons-container">
                                        <button className="save-edit-btn" onClick={handleSaveEditedNote}>Save</button>
                                        <button className="cancel-edit-btn" onClick={() => setEditNoteId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>{note.note}</p>
                                    <small>{new Date(note.date.seconds * 1000).toLocaleDateString()}</small>
                                    <div className='buttons-container'>
                                        <button
                                            className='edit-btn'
                                            onClick={() => handleEditNote(note.id, note.note)}>Edit</button>
                                        <button
                                            className='delete-btn'
                                            onClick={() => handleDeleteNote(note.id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
