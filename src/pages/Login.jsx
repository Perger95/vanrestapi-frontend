import React, { useState } from 'react';
import { loginUser } from '../api';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(email, password);
            setToken(data.token);
            localStorage.setItem('token', data.token);
        } catch (error) {
            setError("❌ Invalid email or password.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Bejelentkezés</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                    <button type="submit" style={styles.loginButton}>
                        <img src="/images/login-icon.png" alt="Login Icon" style={styles.icon} />
                        Login
                    </button>
                    {error && <p style={styles.errorText}>{error}</p>}
                </form>
                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
};

// 🎨 Stílusok
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // Biztosítja a vertikális elrendezést
        margin: 'auto',
        padding: '30px 20px', 
        minHeight: '220px', 
        backgroundColor: '#f4f4f4',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transform: 'translateY(4cm)', 
        maxWidth: '400px' 
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '350px',
    },
    heading: {
        color: '#333',
        marginBottom: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '12px 15px', // Növelt padding, hogy egyezzen a gombbal
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        width: '100%',
        boxSizing: 'border-box', // Fontos, hogy ne változzon a méret
    },
    loginButton: {
        backgroundColor: '#4646FF',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        lineHeight: '1.2', // Jobb vertikális igazítás
    },
    icon: {
        width: '20px',
        height: '20px',
        marginRight: '10px',
    },
    errorText: {
        color: 'red',
        marginTop: '10px',
    },
};

export default Login;
