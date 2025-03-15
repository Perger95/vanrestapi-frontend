import axios from 'axios';

// API alap URL-je
const API_BASE_URL = "https://localhost/plain-php-api/index.php";

// Bejelentkezés
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}?users=login`, { email, password });
    return response.data;
};

// Események lekérése
export const getEvents = async (token) => {
    const response = await axios.get(`${API_BASE_URL}?events`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Új esemény létrehozása
export const createEvent = async (eventData, token) => {
    const response = await axios.post(`${API_BASE_URL}?events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Esemény frissítése (PATCH)
export const updateEvent = async (id, updateData, token) => {
    const response = await axios.patch(`${API_BASE_URL}?events=${id}`, updateData, {
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return response.data;
};

 
// Esemény törlése
export const deleteEvent = async (id, token) => {
    const response = await axios.delete(`${API_BASE_URL}?events&id=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};