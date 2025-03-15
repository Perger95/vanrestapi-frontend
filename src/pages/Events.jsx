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
            setEvents(prevEvents => [...prevEvents, createdEvent]);
            setTitle('');
            setOccurrence('');
            setDescription('');
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("❌ Biztosan törölni szeretnéd ezt az eseményt?")) return;
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
        navigate("/");
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h2 style={styles.heading}> My Events</h2>

                <ul style={styles.eventList}>
                    {events.map(event => {
                        let formattedDate = "Invalid Date";
                        if (event.occurrence) {
                            try {
                                const parsedDate = new Date(event.occurrence);
                                formattedDate = !isNaN(parsedDate.getTime()) 
                                    ? parsedDate.toLocaleString() 
                                    : "Invalid Date";
                            } catch (error) {
                                console.error("❌ Date parsing error:", error);
                            }
                        }

                        return (
                            <li key={event.id || Math.random()} style={styles.eventCard}>
                                <div style={styles.eventContent}>
                                    <h3>{event.title}</h3>
                                    <p><strong>📅 Date: </strong>{formattedDate}</p>
                                    <p><strong> Description: </strong>{event.description || "No description"}</p>
                                </div>

                                <div style={styles.eventActions}>
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
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setEditId(event.id); setEditDescription(event.description || '') }} style={styles.editButton}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteEvent(event.id)} style={styles.deleteButton}>
                                                ✗ Delete
                                            </button>
                                        </>
                                    )}
                                </div>
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
                    <button type="submit" style={styles.createButton}>Add new Event</button>
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

            <div style={{ height: "80000px" }} /> {/* Adds extra space below */}
        </div>
    );
};

// 🎨 **Frissített Stílusok**
const styles = {
    background: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "99vw",
        height: "150vh",
        backgroundImage: "url('/images/calendar.png')",
        backgroundSize: "cover",
        backgroundPosition: "top left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        backgroundRepeat: "repeat",
        paddingBottom: "50px",
        paddingTop: "50px",
        maxHeight: "130vh", 
        overflowY: "hidden", // Prevent unnecessary vertical scrolling
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
        Width: "550px",
        textAlign: "center",
        minHeight: "520px",
        overflowY: "auto",
    },
    heading: {
        color: '#000000',
        marginBottom: '15px',
        fontSize: '36px', // Nagyobb szöveg
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)', // 🔹 Árnyék hozzáadása
        padding: '10px 20px', // Térköz a háttérhez
        borderRadius: '8px', // Lekerekített sarkok
        color: 'black', // Fehér szöveg
        display: 'inline-block', // Csak a szöveg méretéig nyúljon
    },
    eventList: {
        color: '#000000',
        textAlign: "left",  
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
        marginTop: '12px' ,
        width: '100%',  
        maxWidth: '200px', 
        marginBottom: '100px'
    },
    logoutButton: {
        backgroundColor: "#FF4500",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        width: "45%",
        height: "40px",  // 🔹 Egységes magasság
        lineHeight: 'normal',
        marginTop: '14px',
    },
    helpdeskButton: {
        backgroundColor: "#4646FF",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        width: "45%",
        height: "40px",
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

    editButton: {
        backgroundColor: "rgba(136, 123, 123, 0.95)",
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '12px',
        cursor: 'pointer',
        marginRight: '5px'
    },

    deleteButton: {
        backgroundColor: '#D2595C',
        color: 'white',
        border: 'none',
        padding: '4px 10px',
        borderRadius: '13px',
        cursor: 'pointer',
        display: 'inline-block', 
    },
};

export default Events;
