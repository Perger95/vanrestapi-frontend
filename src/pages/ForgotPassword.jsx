import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", display: "block", width: "100%" }}
      />
      <button onClick={handleResetRequest} style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;
