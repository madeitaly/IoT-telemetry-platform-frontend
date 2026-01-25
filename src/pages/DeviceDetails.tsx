//This page shows specific data for one device.
//import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks for URL handling
import API from "../api/axiosConfig";
import type { Device } from '../interfaces/Device';
import type { Telemetry } from '../interfaces/Telemetry';
import { useAuth } from '../context/AuthContext';
import { X, Copy, Check } from 'lucide-react';

const DeviceDetails = () => {

    const { user } = useAuth(); // Make sure to get 'user' from context
    const { id } = useParams(); // Gets the ID from the URL
    const navigate = useNavigate();

    const [device, setDevice] = useState<Device | null>(null);
    const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
    const [loading, setLoading] = useState(true);

    // State for the Token Modal
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [deviceToken, setDeviceToken] = useState<string>("");
    const [tokenLoading, setTokenLoading] = useState(false);
    const [copied, setCopied] = useState(false);

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

    }, [id, user, navigate]);

    // Function to fetch the token when button is clicked
    const handleViewToken = async () => {
        if (!id || !user?.id) return;
        setTokenLoading(true);
        setShowTokenModal(true); // Open modal immediately showing loading state

        try {
            const res = await API.get(`/api/devices/${user.id}/${id}/deviceToken`);
            // Assuming the response is { token: "..." } or just the string
            setDeviceToken(res.data.token || res.data); 
        } catch (err) {
            console.error(err);
            setDeviceToken("Error fetching token");
        } finally {
            setTokenLoading(false);
        }
    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(deviceToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to format dates
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleString();
    };

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
                <div className="flex gap-4">
                    <button 
                        onClick={handleViewToken}
                        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                    >
                        🔑 View Token
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline px-2 py-2">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Organised Device Info Section */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Device Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Location</span>
                        <span className="text-gray-800 font-medium">{device.location}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Last Seen</span>
                        <span className={`font-medium ${!device.lastSeen ? 'text-gray-400' : 'text-gray-800'}`}>
                            {formatDate(device.lastSeen)}
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Created At</span>
                        <span className="text-gray-600 text-sm">{formatDate(device.createdAt)}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-400 uppercase">Last Update</span>
                        <span className="text-gray-600 text-sm">{formatDate(device.updatedAt)}</span>
                    </div>
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

            {/* Requirement 2: Token Modal (Popup) */}
            {showTokenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl relative">
                        <button 
                            onClick={() => setShowTokenModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                        
                        <h3 className="text-xl font-bold mb-4">Device Security Token</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Use this token to authenticate your physical device (ESP32/Raspberry Pi) when sending telemetry.
                        </p>

                        {tokenLoading ? (
                            <div className="text-center py-4">Loading Token...</div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <code className="block w-full bg-gray-100 p-3 rounded border font-mono text-sm break-all text-gray-800">
                                    {deviceToken}
                                </code>
                                <button 
                                    onClick={handleCopyToken}
                                    className="p-3 bg-gray-200 rounded hover:bg-gray-300 transition"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={18} className="text-green-600"/> : <Copy size={18}/>}
                                </button>
                            </div>
                        )}
                        
                        <div className="mt-6 text-right">
                            <button 
                                onClick={() => setShowTokenModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DeviceDetails;