import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: ''});
    const navigate = useNavigate();
    const { login } = useAuth(); // Access the login function from our Context

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the browser from reloading the page
        try {
            const response = await axios.post('http://localhost:3000/auth/register', formData);

            // Deconstruct the response based on your backend JSON
            const { token, user } = response.data;

            // Pass both pieces of data to our Context
            login(token, user);

            //alert("Registration successful!");
            
            // Go to the device list
            navigate('/dashboard');
            
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