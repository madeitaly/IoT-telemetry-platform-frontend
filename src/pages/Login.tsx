import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Access the login function from our Context
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            login(response.data.token); // Save the token globally
            navigate('/dashboard');     // Go to the device list
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">IoT Portal Login</h2>
                <input 
                type="email" placeholder="Email" className="w-full border p-2 mb-4"
                onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                type="password" placeholder="Password" className="w-full border p-2 mb-4"
                onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;