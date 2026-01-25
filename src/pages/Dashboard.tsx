//This page fetches the list of devices from the backend.

//import React, { useEffect, useState} from "react";
import { useEffect, useState} from "react";
import API from "../api/axiosConfig";
import { useAuth } from '../context/AuthContext';
import type { Device } from '../interfaces/Device';
import {Link} from "react-router-dom";

const Dashboard = () => {

    const { user } = useAuth(); // Grab the logged-in user (with the ID)
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            // ⚠️ sending body in GET via 'data' property
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
                                to={`/edit-device/${device.id}`} 
                                className="font-medium text-amber-600 hover:underline"
                            >
                                Edit
                            </Link>
                            
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