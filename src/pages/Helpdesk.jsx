import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Helpdesk = ({ token }) => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

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

    return (
        <div>
            {/* 🔹 Floating Chat Button */}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.chatToggle}>
                {isOpen ? "❌ Close" : "💬 Help"}
            </button>

            {/* 🔹 Chat Window */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.chatHeader}>
                        <h3>Helpdesk AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} style={styles.closeButton}>❌</button>
                    </div>

                    {/* 🔹 Messages List */}
                    <div style={styles.chatBody}>
                        {messages.map((msg, index) => (
                            <div key={index} style={msg.type === "user" ? styles.userMessage : styles.aiMessage}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* 🔹 Chat Input */}
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
    );
};

// 🎨 **Updated Styles (Larger & More Responsive)**
const styles = {
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
        width: "400px", // 🔹 Bigger Chat Window
        height: "450px", // 🔹 Increased Height
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
        maxHeight: "300px", // More scrolling space
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
        maxWidth: "85%", // Slightly wider
        alignSelf: "flex-end",
        fontSize: "16px", // Bigger text
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
        fontSize: "15px", // Bigger input text
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

export default Helpdesk;
