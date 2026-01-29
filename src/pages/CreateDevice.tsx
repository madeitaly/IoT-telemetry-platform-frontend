import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CreateDevice = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        serial: '',
        name: '',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.id) return alert("User not identified");

        try {
            // POST to api/devices/:userId
            const response = await API.post(`/api/devices/${user.id}`, formData);
            
            const jsonString = JSON.stringify(response.data, null, 2);

            alert("Device created successfully!\n\nBackend Response:\n" + jsonString);
            navigate('/dashboard'); // Go back to the list
        } catch (err) {
            console.error(err);
            alert("Failed to create device. Check console for details.");
        }
    };

    return (
        <div className="p-8 flex justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Register New Device</h2>
                
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Serial Number</label>
                        <input 
                            type="text" 
                            placeholder="e.g. SN-613231-86"
                            className="w-full border p-2 rounded font-mono"
                            required
                            value={formData.serial}
                            onChange={(e) => setFormData({...formData, serial: e.target.value})}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Device Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Living Room Sensor"
                            className="w-full border p-2 rounded"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                        <input 
                            type="text" 
                            placeholder="e.g. My Home"
                            className="w-full border p-2 rounded"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-between">
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDevice;