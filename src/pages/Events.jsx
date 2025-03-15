import React, { useEffect, useState } from 'react';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../api';
import { useNavigate } from 'react-router-dom';

const Events = ({ token, setToken }) => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [occurrence, setOccurrence] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [editDescription, setEditDescription] = useState('');

    const navigate = useNavigate();

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

            let formattedOccurrence = null;
            if (createdEvent.occurrence) {
                const parsedDate = new Date(createdEvent.occurrence);
                formattedOccurrence = isNaN(parsedDate.getTime()) 
                    ? null  
                    : parsedDate.toISOString();
            }

            setTimeout(() => {
                setEvents(prevEvents => [
                    ...prevEvents, 
                    { ...createdEvent, occurrence: formattedOccurrence }
                ]);
            }, 100);

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

            {/* 🔹 Gombok konténer */}
            <div style={styles.buttonContainer}>
                <button onClick={() => navigate('/helpdesk')} style={styles.helpdeskButton}>
                    Helpdesk
                    <img src="/images/helpdesk-icon.png" alt="HelpDesk Icon" style={styles.iconRight} />
                </button>

                <button onClick={handleLogout} style={styles.logoutButton}> 
                    <img src="/images/login-icon.png" alt="Login Icon" style={styles.iconLeft} />
                    Logout
                </button>
            </div>
        </div>
    );
};

// Stílusok
const styles = {
    container: {
        maxWidth: '600px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '350px',
        marginTop: '130px'
    },
    
    heading: {
        color: '#333',
        marginBottom: '15px',
        fontSize: '26px', // Nagyobb szöveg
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)', // 🔹 Árnyék hozzáadása
        background: 'linear-gradient(to right, #4CAF50, #2E8B57)', // 🔥 Szép háttérszín
        padding: '10px 20px', // Térköz a háttérhez
        borderRadius: '8px', // Lekerekített sarkok
        color: 'white', // Fehér szöveg
        display: 'inline-block', // Csak a szöveg méretéig nyúljon
    },
    
    iconRight: {
        width: '20px',  // 🔹 Kép szélessége
        height: '20px', // 🔹 Kép magassága
        marginLeft: '8px', // 🔹 Kicsi térköz a szöveg után
        verticalAlign: 'middle' // 🔹 Szöveg közé igazítása
    },

    iconLeft: {
        width: '20px',  // 🔹 Kép szélessége
        height: '20px', // 🔹 Kép magassága
        marginRight: '8px', // 🔹 Térköz a szöveg és a kép között
        verticalAlign: 'middle' // 🔹 Kép függőleges igazítása a szöveghez
    },

    createButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: '0.3s',
        display: 'inline-block',  // ✅ Biztosítja, hogy ne örököljön flex stílust!
        textAlign: 'center',
        marginTop: '10px' ,
        width: '100%',  
        maxWidth: '200px' 
        //marginBottom: '20px'
    },
    editButton: {
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '5px',
        display: 'inline-block', // ✅ Fixálja a gombot!
        textAlign: 'center'
    },
    deleteButton: {
        backgroundColor: '#D2595C',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'inline-block', // ✅ Megoldja a kinézeti problémát!
        textAlign: 'center'
    },

    helpdeskButton: {
        backgroundColor: '#4646FF',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '14px',
        transition: '0.3s',
        display: 'flex',  
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 'normal',
        gap: '5px',
        height: '40px',
    },
    logoutButton: {
        backgroundColor: '#FF4500',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
        display: 'block',
        margin: '20px auto',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',  // 🔹 Egységes magasság
        lineHeight: 'normal',
        marginTop: '14px'

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
};

export default Events;
