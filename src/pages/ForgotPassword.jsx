import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); 

    const handleResetRequest = async () => {
        if (!email) {
            setMessage("Please enter your email.");
            return;
        }

        const response = await fetch("https://localhost/plain-php-api/index.php?users=reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setMessage(data.message || "If this email exists, a reset link has been sent.");
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.imageContainer}>
                <img src="/images/reset-password.jpg" alt="Reset Password" style={styles.image} />
                    </div>
                    <div style={styles.container}>
                        <h1 style={styles.heading}>Forgot Password?</h1>
                        <p style={styles.subtitle}>
                            Enter your registered email and we'll send you a password reset link.
                        </p>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                <button onClick={handleResetRequest} style={styles.button}>
                            Reset Password</button>
                        {message && <p style={styles.message}>{message}</p>}
                        <button onClick={() => navigate("/")} style={styles.backButton}>
                            Back to Login</button>
            </div>
        </div>
    );
}


const styles = {
    wrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        gap: "50px",
    },
    imageContainer: {
        flex: "0 0 30%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: "translateY(6cm)",
    },
    image: {
        width: "100%",
        maxWidth: "500px",
        height: "auto",
        transform: "translateY(-3cm)",
        transform: "translateX(-7cm)",
    },
    container: {
        flex: "0 0 30%",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0px 5px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        marginTop: "5vh",
        transform: "translateX(-8cm)",
    },
    heading: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "16px",
        color: "#555",
        marginBottom: "20px",
    },
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
        width: "100%",
        boxSizing: "border-box",
        marginBottom: "15px",
    },
    button: {
        backgroundColor: "#4646FF",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        width: "100%",
    },
    message: {
        marginTop: "15px",
        fontSize: "14px",
        color: "#333",
    },
    backButton: {
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        padding: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        width: "40%",
        marginTop: "15px",
    },
};

export default ForgotPassword;
