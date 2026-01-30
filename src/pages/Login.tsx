import React, { useState } from 'react';
import API from "../api/axiosConfig";
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
            const response = await API.post('/auth/login', { email, password });
            
            // Deconstruct the response based on your backend JSON
            const { token, user } = response.data;

            // Pass both pieces of data to our Context
            login(token, user);

            // Go to the device list
            navigate('/dashboard');

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