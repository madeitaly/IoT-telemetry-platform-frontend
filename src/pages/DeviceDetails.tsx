//This page shows specific data for one device.
//import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//import axios from 'axios';
import API from "../api/axiosConfig";

const DeviceDetails = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        API.get(`api/devices/telemetry/${id}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    }, [id]);

    if (!data) return <p>Loading telemetry...</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Device: {data.deviceName}</h1>
            <div className="bg-blue-100 p-6 rounded-lg inline-block">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-4xl font-mono">{data.temperature}°C</p>
            </div>
            {/* Add more cards for Humidity, Voltage, etc. */}
        </div>
    );
};

export default DeviceDetails;