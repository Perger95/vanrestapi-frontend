import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Events from './pages/Events';
import Helpdesk from './pages/Helpdesk'; // Új Helpdesk oldal importálása
import ResetPassword from "./pages/resetpassword";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={token ? <Events token={token} setToken={setToken} /> : <Login setToken={setToken} />} 
                />
                <Route 
                    path="/helpdesk" 
                    element={token ? <Helpdesk token={token} /> : <Login setToken={setToken} />} />
                 <Route path="/reset-password" element={<ResetPassword />} />
                 <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
        </Router>
    );
};

export default App;
