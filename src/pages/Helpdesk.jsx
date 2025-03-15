import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Helpdesk = ({ token }) => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResponse(null);

        try {
            const res = await axios.post(
                'https://localhost/plain-php-api/index.php?helpdesk', 
                { question }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setResponse(res.data.answer);
        } catch (err) {
            setError('An error occurred while sending your question.');
        }

        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Helpdesk AI Assistant</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                    placeholder="Please type here to ask..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <button type="submit" style={styles.submitButton} disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </form>
            
            {error && <p style={styles.error}>{error}</p>}
            {response && (
                <div style={styles.response}>
                    <h3>Response:</h3>
                    <p>{response}</p>

             {/* 🔹 Vissza gomb az Eseményekhez */}
             <button onClick={() => navigate('/')} style={styles.backButton}>
                Return to main page
            </button>
                </div>
            )}
        </div>
    );
};

// 🎨 **Stílusok**
const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    heading: {
        color: '#333',
        marginBottom: '15px',
        fontFamily: "'Emblema One', cursive",
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '10px',
    },
    textarea: {
        width: '100%',
        height: '100px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        resize: 'none',
    },
    submitButton: {
        backgroundColor: '#4646FF',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
    response: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f8f8',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    backButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '14px',
        transition: '0.3s',
    },
};

export default Helpdesk;
