import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import type { Device } from '../interfaces/Device';

const EditDevice = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // We keep the full device object for read-only info (Serial, ID, etc.)
    const [device, setDevice] = useState<Device | null>(null);
    
    // We use a separate state for the fields we want to edit
    const [formData, setFormData] = useState({
        name: '',
        location: ''
    });

    const [loading, setLoading] = useState(true);

    // 1. Fetch current data to pre-fill the form
    useEffect(() => {
        if (!user?.id || !id) return;

        API.get(`/api/devices/${user.id}/${id}`)
            .then(res => {
                setDevice(res.data);
                // Pre-fill the form with existing values
                setFormData({
                    name: res.data.name,
                    location: res.data.location
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                alert("Could not load device data");
                navigate('/dashboard');
            });
    }, [id, user, navigate]);

    // 2. Handle the Update (PATCH)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.patch(`/api/devices/${user?.id}/${id}`, formData);
            alert("Device updated successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update device.");
        }
    };

    if (loading || !device) return <div className="p-8">Loading device info...</div>;

    return (
        <div className="p-8 flex justify-center">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Edit Device</h2>
                
                {/* Read-Only Info Section */}
                <div className="bg-gray-50 p-4 rounded mb-6 border">
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Device Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block">Serial Number</span>
                            <span className="font-mono font-medium">{device.serial}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Database ID</span>
                            <span className="font-mono font-medium">{device.id}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block">Created At</span>
                            <span>{new Date(device.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Editable Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Device Name</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 font-medium"
                        >
                            Confirm Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDevice;