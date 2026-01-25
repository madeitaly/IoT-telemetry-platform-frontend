//This page shows specific data for one device.
//import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks for URL handling
import API from "../api/axiosConfig";
import type { Device } from '../interfaces/Device';
import type { Telemetry } from '../interfaces/Telemetry';
import { useAuth } from '../context/AuthContext';

const DeviceDetails = () => {

    const { user } = useAuth(); // Make sure to get 'user' from context

    const { id } = useParams(); // Gets the ID from the URL
    const navigate = useNavigate();

    const [device, setDevice] = useState<Device | null>(null);
    const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!id || !user?.id) return; // Wait for both Device ID and User ID

        // We use Promise.all to fetch both "Header info" and "Table data" at the same time
        const fetchData = async () => {
            try {
                const [deviceRes, telemetryRes] = await Promise.all([
                    API.get(`/api/devices/${user.id}/${id}`),             // Get name, serial, etc.
                    API.get(`/api/telemetry/${id}`)    // Get the array of data points
                ]);
                setDevice(deviceRes.data);
                setTelemetry(telemetryRes.data);
            } catch (err) {
                console.error("Error fetching details", err);
                alert("Could not load device data.");
                navigate('/dashboard'); // Send them back if the ID is wrong
            } finally {
                setLoading(false);
            }
        }
        fetchData();

    }, [id, navigate]);

    if (loading) return <div className="p-8">Loading telemetry...</div>;
    if (!device) return <div className="p-8">Device not found</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                <h1 className="text-3xl font-bold text-gray-800">{device.name}</h1>
                <p className="text-gray-500">SN: <span className="font-mono">{device.serial}</span></p>
                </div>
                <div className="text-right">
                    <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
                    ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Telemetry Table */}
            <div className="overflow-hidden bg-white shadow sm:rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firmware</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {telemetry.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.ts).toLocaleString()}
                        </td>
                        
                        {/* Accessing nested Payload properties */}
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${log.payload.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {log.payload.status.toUpperCase()}
                        </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.payload.firmware}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {log.temperature.toFixed(1)}°C
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.humidity.toFixed(1)}%
                        </td>
                        
                        {/* Dynamic color for battery */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        <span className={log.battery < 20 ? 'text-red-600' : 'text-green-600'}>
                            {log.battery}%
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                
                {telemetry.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No telemetry data recorded yet.</div>
                )}
            </div>
        </div>
    );
};

export default DeviceDetails;