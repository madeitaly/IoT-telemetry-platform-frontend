//This page fetches the list of devices from the backend.

//import React, { useEffect, useState} from "react";
import { useEffect, useState} from "react";
import API from "../api/axiosConfig";
//import axios from "axios";
import {Link} from "react-router-dom";

const Dashboard = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        API.get('/api/devices')
        .then(res => setDevices(res.data))
        .catch(err => console.error(err));
    }, []); 
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Your IoT Devices</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {devices.map((device: any) => (
                <Link to={`/device/${device.id}`} key={device.id} className="border p-4 rounded shadow hover:bg-gray-50">
                    <h2 className="font-bold">{device.name}</h2>
                    <p>Location: {device.location}</p>
                    <span className={device.online ? "text-green-500" : "text-red-500"}>
                    {device.online ? "● Online" : "○ Offline"}
                    </span>
                </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;