import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, deleteEvent } from '../api';

const Events = ({ token }) => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [occurrence, setOccurrence] = useState('');

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
            const newEvent = { title, occurrence };
            const createdEvent = await createEvent(newEvent, token);
            setEvents([...events, createdEvent]); // Új esemény hozzáadása a listához
            setTitle('');
            setOccurrence('');
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleDeleteEvent = async (id) => {
        const confirmDelete = window.confirm("❌ Biztosan törölni szeretnéd ezt az eseményt?");
        if (!confirmDelete) return;

        try {
            await deleteEvent(id, token);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id)); // Törölt esemény eltávolítása a listából
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}> My Events</h2>
            
            <ul style={styles.eventList}>
                {events.map(event => (
                    <li key={event.id} style={styles.eventItem}>
                        <span style={styles.eventText}>
                            <strong>{event.title}</strong> - {new Date(event.occurrence).toLocaleString()}
                        </span>
                        <button 
                            onClick={() => handleDeleteEvent(event.id)} 
                            style={styles.deleteButton}
                        >
                            ✗ Delete
                        </button>
                    </li>
                ))}
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
                <button type="submit" style={styles.createButton}>➕ Create Event</button>
            </form>
        </div>
    );
};

// 🎨 Stílusok
const styles = {
    container: {
        maxWidth: '500px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    heading: {
        color: '#333',
        marginBottom: '15px',
        fontFamily: "'Emblema One', cursive",
    },
    eventList: {
        listStyleType: 'none',
        padding: 0,
    },
    eventItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
    },
    eventText: {
        flex: 1,
        textAlign: 'left',
    },
    deleteButton: {
        backgroundColor: '#D2595C',  // lágypiros 
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '20px', // Lekerekített gomb
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: '0.3s',
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '20px',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    createButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Events;