import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
    }
  }, [token]);

  const handleReset = async () => {
    if (!token || newPassword.length < 6) {
      setMessage("Invalid token or password too short.");
      return;
    }

    try {
      console.log("📡 Küldés a szerverre:", {
        token,
        new_password: newPassword
      });

      const response = await fetch("https://localhost/plain-php-api/index.php?users=new-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"  // 🔹 FONTOS! A backend így biztosan JSON-ként dolgozza fel
        },
        body: JSON.stringify({
          token: token.trim(),  
          new_password: newPassword.trim()
        }),
      });

      console.log("✅ Válasz érkezett:", response);

      const data = await response.json();
      console.log("📬 Szerver válasz:", data);

      if (!response.ok) {
        throw new Error(data.error || "Data error!");
      }

      setMessage(data.message || "Your password just has been reset!");
    } catch (error) {
      console.error("🚨 Fetch hiba:", error);
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", display: "block", width: "100%" }}
      />
      <button onClick={handleReset} style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
