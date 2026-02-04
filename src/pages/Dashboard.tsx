//This page fetches the list of devices from the backend.

//import React, { useEffect, useState} from "react";
import { useEffect, useState} from "react";
import API from "../api/axiosConfig";
import { useAuth } from '../context/AuthContext';
import type { Device } from '../interfaces/Device';
import {Link} from "react-router-dom";
import { Trash2 } from "lucide-react"; // Import the Bin Icon

const Dashboard = () => {

    const { user } = useAuth(); // Grab the logged-in user (with the ID)
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            API.get(`/api/devices/${user.id}`)
            .then((res) => {
                setDevices(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch devices", err);
                setLoading(false);
            });
        }
    }, [user]); 
    
    // Handle Delete Logic
    const handleDelete = async (deviceId: number) => {
        // 1. Confirm with the user
        if (!window.confirm("Are you sure you want to delete this device? This cannot be undone.")) {
            return;
        }

        try {
            // 2. Call the API (Assuming your backend supports DELETE /api/devices/:userId/:deviceId)
            await API.delete(`/api/devices/${user?.id}/${deviceId}`);

            // 3. Update the UI locally (Remove the deleted item from the list)
            setDevices(prevDevices => prevDevices.filter(d => d.id !== deviceId));
            
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete device.");
        }
    };

    // Helper to format dates cleanly
    const formatDate = (dateString: string | null) => {
        if (!dateString) return <span className="text-gray-400">Never</span>;
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div className="p-8">Loading devices...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold mb-6">Device Management</h1>

                <Link 
                    to="/create-device" 
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    + Add New Device
                </Link>
            </div>

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3">Device Name</th>
                        <th scope="col" className="px-6 py-3">Serial Number</th>
                        <th scope="col" className="px-6 py-3">Location</th>
                        <th scope="col" className="px-6 py-3">Status (Last Seen)</th>
                        <th scope="col" className="px-6 py-3">Created At</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                        <tr key={device.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {device.name}
                            </td>
                            <td className="px-6 py-4 font-mono">
                            {device.serial}
                            </td>
                            <td className="px-6 py-4">
                            {device.location}
                            </td>
                            <td className="px-6 py-4">
                            {/* Logic: If seen recently, show Online, else Offline? 
                                For now, we just show the date. */}
                            {formatDate(device.lastSeen)}
                            </td>
                            <td className="px-6 py-4">
                            {formatDate(device.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                            <Link 
                                to={`/device/${device.id}`} 
                                className="font-medium text-blue-600 hover:underline"
                            >
                                View Data
                            </Link>

                            <Link 
                                to={`/live/${device.id}`} 
                                className="font-medium text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                Live View
                            </Link>

                            <Link 
                                to={`/edit-device/${device.id}`} 
                                className="font-medium text-amber-600 hover:underline"
                            >
                                Edit
                            </Link>
                            
                            <button 
                                onClick={() => handleDelete(device.id)}
                                className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                                title="Delete Device"
                            >
                                <Trash2 size={18} />
                            </button>

                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                
                {devices.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No devices found. Click "Add New Device" to start.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;