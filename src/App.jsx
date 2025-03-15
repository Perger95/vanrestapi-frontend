import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Events from './pages/Events';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <Router>
            <Routes>
                <Route 
                    path="/" 
                    element={token ? <Events token={token} setToken={setToken} /> : <Login setToken={setToken} />} 
                />
            </Routes>
        </Router>
    );
};

export default App;
