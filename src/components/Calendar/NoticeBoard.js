import React, { useEffect, useState, useCallback } from 'react';
import { fetchNotes, modifyNote, deleteNote } from '../../firebase/firebaseService'; // Import new functions
import { useSelector } from 'react-redux';

const NoticeBoard = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle error state
    const [editNoteId, setEditNoteId] = useState(null); // State to track note being edited
    const [editedNoteText, setEditedNoteText] = useState(""); // State to track edited note content
    const userId = useSelector(state => state.auth.userId);

    // Memoize the randomColor function
    const randomColor = useCallback(() => {
        const colors = [
            'note-blue', 'note-yellow', 'note-beige', 'note-peach', 'note-green', 'note-pink',
            'note-lavender', 'note-mint', 'note-rose', 'note-sky', 'note-sand', 'note-cream'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    // Fetch notes only if userId is available
    useEffect(() => {
        const getNotes = async () => {
            try {
                setLoading(true);
                const notesData = await fetchNotes(userId);
                setNotes(notesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching notes: ", error);
                setError("Failed to load notes. Please try again later.");
                setLoading(false);
            }
        };

        if (userId) {
            getNotes();
        }
    }, [userId]);

    const handleEditNote = (noteId, currentText) => {
        setEditNoteId(noteId);
        setEditedNoteText(currentText);
    };

    const handleSaveEditedNote = async () => {
        if (!editedNoteText.trim()) return;
        try {
            await modifyNote(userId, editNoteId, editedNoteText.trim());
            setNotes(prevNotes => prevNotes.map(note =>
                note.id === editNoteId ? { ...note, note: editedNoteText.trim() } : note
            ));
            setEditNoteId(null);
            setEditedNoteText("");
        } catch (error) {
            console.error("Error saving edited note:", error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(userId, noteId);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
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
        return (
            <div>
                {error}
                <button onClick={() => setLoading(true)}>Retry</button>
            </div>
        ); // Retry button to fetch data again
    }

    return (
        <div className="noticeboard">
            <h2 className="noticeboard-title">Notice Board</h2>
            {notes.length === 0 ? (
                <p>No notes available</p>
            ) : (
                <div className="sticky-notes-container">
                    {notes.map(note => (
                        <div key={note.id} className={`sticky-note ${randomColor()}`}>
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
                                        <button className='edit-btn' onClick={() => handleEditNote(note.id, note.note)}>Edit</button>
                                        <button className='delete-btn' onClick={() => handleDeleteNote(note.id)}>Delete</button>
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
