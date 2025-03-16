import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getEvents, createEvent, deleteEvent, updateEvent } from "../api";

const Events = ({ token, setToken }) => {
    // Helpdesk 
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Events 
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [occurrence, setOccurrence] = useState("");
    const [description, setDescription] = useState("");
    const [editId, setEditId] = useState(null);
    const [editDescription, setEditDescription] = useState("");

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

    // Submit Helpdesk
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "https://localhost/plain-php-api/index.php?helpdesk",
                { question },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessages([...messages, { type: "user", text: question }, { type: "ai", text: res.data.answer }]);
            setQuestion("");
        } catch (err) {
            setError("An error occurred while sending your question.");
        }

        setLoading(false);
    };

    // Create Event
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = { title, occurrence, description };
            const createdEvent = await createEvent(newEvent, token);
            setEvents((prevEvents) => [...prevEvents, createdEvent]);
            setTitle("");
            setOccurrence("");
            setDescription("");
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    // Delete Event
    const handleDeleteEvent = async (id) => {
        if (!window.confirm("❌ Are you sure you want to delete this event?")) return;
        try {
            await deleteEvent(id, token);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // Edit Event
    const handleEditEvent = async (id) => {
        try {
            await updateEvent(id, { description: editDescription }, token);
            setEvents((prevEvents) =>
                prevEvents.map((event) => (event.id === id ? { ...event, description: editDescription } : event))
            );
            setEditId(null);
            setEditDescription("");
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h2 style={styles.heading}>My Events</h2>
                <ul style={styles.eventList}>
                    {events.map((event) => (
                        <li key={event.id || Math.random()} style={styles.eventCard}>
                            <div style={styles.eventContent}>
                                <h3>{event.title}</h3>
                                    <p>
                                    <strong>📅 Date: </strong>
                                        {event.occurrence ? new Date(event.occurrence).toLocaleString() : "Invalid Date"}
                                    </p>
                                    <p>
                                    <strong>Description: </strong>
                                        {event.description || "No description"}
                                    </p>
                            </div>
    
                            {/* Edit & Delete Buttons */}
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
                                        <button
                                            onClick={() => {
                                                setEditId(event.id);
                                                setEditDescription(event.description || "");
                                            }}
                                            style={styles.editButton}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteEvent(event.id)} style={styles.deleteButton}>
                                            ✗ Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
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
                    <button type="submit" style={styles.createButton}>Add New Event</button>
                </form>
                <div style={styles.buttonContainer}>
                    <button onClick={() => setIsOpen(!isOpen)} style={styles.helpdeskButton}>
                        Helpdesk
                        <img src="/images/helpdesk-icon.png" alt="HelpDesk Icon" style={styles.iconRight} />
                    </button>
    
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        <img src="/images/login-icon.png" alt="Login Icon" style={styles.iconLeft} />
                        Logout
                    </button>
                </div>
            </div>
    
            {/* Floating AI Chat System  */}
            <div style={styles.chatContainer}>
                <button onClick={() => setIsOpen(!isOpen)} style={styles.chatToggle}>
                    {isOpen ? "❌ Close" : "💬 Help"}
                </button>
    
                {isOpen && (
                    <div style={styles.chatWindow}>
                        <div style={styles.chatHeader}>
                            <h3>Helpdesk AI Assistant</h3>
                            <button onClick={() => setIsOpen(false)} style={styles.closeButton}>
                                ❌
                            </button>
                        </div>
    
                        {/* Messages */}
                        <div style={styles.chatBody}>
                            {messages.map((msg, index) => (
                                <div key={index} style={msg.type === "user" ? styles.userMessage : styles.aiMessage}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
    
                        {/*Chat Input */}
                        <form onSubmit={handleSubmit} style={styles.chatForm}>
                            <textarea
                                placeholder="Type your message..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                                style={styles.chatInput}
                            />
                            <button type="submit" style={styles.sendButton} disabled={loading}>
                                {loading ? "..." : "➤"}
                            </button>
                        </form>
    
                        {error && <p style={styles.error}>{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};    
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
        overflowY: "hidden",
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
        width: "550px",
        textAlign: "center",
        minHeight: "520px",
        overflowY: "auto",
    },
    eventHeading: {
        color: '#000000',
        marginBottom: '15px',
        fontSize: '36px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        padding: '10px 20px',
        borderRadius: '8px',
        display: 'inline-block',
    },
    eventList: {
        color: '#000000',
        textAlign: "left",
    },
    createButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: '0.3s',
        display: 'inline-block',
        textAlign: 'center',
        marginTop: '12px',
        width: '100%',
        maxWidth: '200px',
        marginBottom: '100px',
        alignItems: "center",
        justifyContent: "center",        
        height: "40px",
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

    // Logout & Helpdesk Buttons
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
        height: "40px",
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

    // 🔹 ICONS FOR BUTTONS
    iconRight: {
        width: "20px",
        height: "20px",
        marginLeft: "8px",
        verticalAlign: "middle",
    },
    iconLeft: {
        width: "20px",
        height: "20px",
        marginRight: "8px",
        verticalAlign: "middle",
    },

    chatToggle: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#007AFF",
        color: "white",
        border: "none",
        padding: "12px 18px",
        borderRadius: "50px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        boxShadow: "0px 4px 10px rgba(0, 122, 255, 0.4)",
    },
    chatWindow: {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "400px",
        height: "450px",
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        boxShadow: "0px 6px 15px rgba(0,0,0,0.6)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    chatHeader: {
        backgroundColor: "#121212",
        color: "white",
        padding: "12px",
        textAlign: "center",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "18px",
    },
    closeButton: {
        background: "none",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
    },
    chatBody: {
        padding: "15px",
        maxHeight: "300px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    userMessage: {
        backgroundColor: "#007AFF",
        color: "white",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "85%",
        alignSelf: "flex-end",
        fontSize: "16px",
    },
    aiMessage: {
        backgroundColor: "#333",
        color: "#e0e0e0",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "85%",
        alignSelf: "flex-start",
        fontSize: "16px",
    },
    chatForm: {
        display: "flex",
        padding: "12px",
        backgroundColor: "#222",
    },
    chatInput: {
        flex: "1",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #444",
        backgroundColor: "#333",
        color: "#e0e0e0",
        resize: "none",
        fontSize: "15px",
    },
    sendButton: {
        backgroundColor: "#007AFF",
        color: "white",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        marginLeft: "8px",
    },
    error: {
        color: "#ff6b6b",
        textAlign: "center",
        padding: "5px",
    },
};

export default Events;
