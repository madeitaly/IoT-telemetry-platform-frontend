import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the browser from reloading the page
        try {
            await axios.post('http://localhost:3000/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login'); // Redirects the user to the login page
            //TBD - Register is already a Login
        } catch (err) {
            alert("Registration failed. Try again.");
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Create Account</h2>
                <input 
                type="email" placeholder="Email" className="w-full border p-2 mb-4"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                type="password" placeholder="Password" className="w-full border p-2 mb-4"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;