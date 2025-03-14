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
                setEvents([...events, newEvent]); // Új esemény hozzáadása a listához
                setTitle('');
                setOccurrence('');
            } catch (error) {
                console.error("Error creating event:", error);
            }
        };

        const handleDeleteEvent = async (id) => {
            if (!window.confirm("Are you sure you want to delete this event?")) return;
    
            try {
                await deleteEvent(id, token);
                setEvents(events.filter(event => event.id !== id)); // Törölt esemény eltávolítása a listából
            } catch (error) {
                console.error("Error deleting event:", error);
            }
        };

    return (
        <div>
            <h2>My Events</h2>
            <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            {event.title} - {event.occurrence}
                            <button onClick={() => handleDeleteEvent(event.id)} style={{ marginLeft: '10px', color: 'red' }}>
                            ❌ Delete
                            </button>
                            
                        </li>
                    ))}
            </ul>
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent}>
                <input 
                    type="text" 
                    placeholder="Event Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <input 
                    type="datetime-local" 
                    value={occurrence} 
                    onChange={(e) => setOccurrence(e.target.value)} 
                    required 
                />
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default Events;
 
