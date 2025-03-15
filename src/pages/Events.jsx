import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../api';

const Events = ({ token, setToken }) => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [occurrence, setOccurrence] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents(token);
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [token]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = { title, occurrence, description };
            const createdEvent = await createEvent(newEvent, token);
    
            // Ellenőrizzük, hogy a dátum valóban megfelelő formátumban van-e
            let formattedOccurrence = null;
            if (createdEvent.occurrence) {
                const parsedDate = new Date(createdEvent.occurrence);
                formattedOccurrence = isNaN(parsedDate.getTime()) 
                    ? null  // Ha érvénytelen, akkor null-t adunk vissza
                    : parsedDate.toISOString();  // ISO formátumba alakítjuk
            }
    
            // Az új eseményt egy időzített állapotfrissítéssel adjuk hozzá
            setTimeout(() => {
                setEvents(prevEvents => [
                    ...prevEvents, 
                    { ...createdEvent, occurrence: formattedOccurrence }
                ]);
            }, 100); // Minimális késleltetés az érvényes adat betöltéséhez
    
            // Formok kiürítése
            setTitle('');
            setOccurrence('');
            setDescription('');
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };
    
    
    

    const handleDeleteEvent = async (id) => {
        const confirmDelete = window.confirm("❌ Biztosan törölni szeretnéd ezt az eseményt?");
        if (!confirmDelete) return;

        try {
            await deleteEvent(id, token);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const handleEditEvent = async (id) => {
        try {
            await updateEvent(id, { description: editDescription }, token);
            setEvents(prevEvents => 
                prevEvents.map(event => 
                    event.id === id ? { ...event, description: editDescription } : event
                )
            );
            setEditId(null);
            setEditDescription('');
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}> My Events</h2>
            
            <ul style={styles.eventList}>
                {events.map(event => {
                    let formattedDate = "Invalid Date";
                    if (event.occurrence) {
                        try {
                            const parsedDate = new Date(event.occurrence);
                            formattedDate = !isNaN(parsedDate) 
                                ? parsedDate.toLocaleString() 
                                : "Invalid Date";
                        } catch (error) {
                            console.error("❌ Date parsing error:", error);
                        }
                    }

                    return (
                        <li key={event.id || Math.random()} style={styles.eventItem}>
                            <span style={styles.eventText}>
                                <strong>{event.title}</strong> - {formattedDate}
                                <br />
                                <em>{event.description || "No description"}</em>
                            </span>

                            {editId === event.id ? (
                                <>
                                    <input 
                                        type="text"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        maxLength="100"
                                        style={styles.input}
                                    />
                                    <button onClick={() => handleEditEvent(event.id)} style={styles.saveButton}>
                                        💾 Save
                                    </button>
                                </>
                             ) : (
                                <>
                                    <button onClick={() => { setEditId(event.id); setEditDescription(event.description || '') }} style={styles.editButton}>
                                        ✏ Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteEvent(event.id)} 
                                        style={styles.deleteButton}>
                                        ✗ Delete
                                    </button>
                                </>
                            )}
                        </li>
                    );
                })}
            </ul>


            <h3 style={styles.heading}> Create New Event ⚡</h3>
            <form onSubmit={handleCreateEvent} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Event Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <input 
                    type="datetime-local" 
                    value={occurrence} 
                    onChange={(e) => setOccurrence(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <input 
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="100"
                    style={styles.input}
                />
                <button type="submit" style={styles.createButton}>➕ Create Event</button>
            </form>

            <button onClick={handleLogout} style={styles.logoutButton}>🚪 Logout</button>
        </div>
    );
};

// Stílusok
const styles = {
    container: {
        maxWidth: '600px',
        margin: 'auto',  // 🌟 Középre igazítás
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center', // 🌟 Szöveg középre igazítása
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // 🌟 Belül minden középre
    },
    logoutButton: {
        backgroundColor: '#FF4500',
        color: 'white',
        border: 'none',
        padding: '10px 20px', // 🛠️ Jobban láthatóvá teszi
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
        display: 'block', // 🌟 Nem inline, hanem saját sorban van
        margin: '20px auto', // 🌟 Középre igazítás
        textAlign: 'center'
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '5px'
    },
    editButton: {
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '5px'
    },
    deleteButton: {
        backgroundColor: '#D2595C',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    descriptionInput: {
        width: '80%', // 🌟 Nem foglalja el az egész sort
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '10px'
    }
};

export default Events;