import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import type { Telemetry } from '../interfaces/Telemetry';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Sector
} from 'recharts';
import { ArrowLeft, RefreshCw, Battery } from 'lucide-react';


const LiveDashboard = () => {

const { id } = useParams();
  const navigate = useNavigate();

  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshRate, setRefreshRate] = useState<number>(5000); // Default 5 seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Ref to manage the interval timer
  const intervalRef = useRef<number | null>(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      // 1. Fetch data
      const res = await API.get(`/api/telemetry/${id}`);
      
      // 2. Sort by timestamp (Oldest -> Newest) for the graph flow
      const sortedData = res.data.sort((a: Telemetry, b: Telemetry) => 
        new Date(a.ts).getTime() - new Date(b.ts).getTime()
      );
      
      setTelemetry(sortedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching live data", err);
    } finally {
      setLoading(false);
    }
  };

  // Setup the Interval
  useEffect(() => {
    fetchData(); // Initial load

    // Clear existing interval if refresh rate changes
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set new interval
    intervalRef.current = setInterval(fetchData, refreshRate);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id, refreshRate]);

  // --- PREPARE DATA FOR VISUALS ---
  
  // 1. Get the most recent reading for the Gauge/Table Top
  const latest = telemetry.length > 0 ? telemetry[telemetry.length - 1] : null;

  // 2. Get last 5 readings for the graphs
  const recentHistory = telemetry.slice(-5);

  // 3. Data for Battery Gauge (Pie Chart simulation)
  // We split 100% into "Charge" (Green) and "Empty" (Gray)
  const batteryData = [
    { 
      name: 'Level', 
      value: latest ? latest.battery : 0, 
      // Define the color directly here based on logic
      fill: latest && latest.battery < 20 ? '#EF4444' : '#10B981' 
    },
    { 
      name: 'Empty', 
      value: latest ? 100 - latest.battery : 100, 
      // The empty part is always gray
      fill: '#E5E7EB' 
    },
  ];

  if (loading) return <div className="p-8">Connecting to device...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Live Telemetry Monitor</h1>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-sm text-gray-500">Last update: {lastUpdated.toLocaleTimeString()}</span>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
            <RefreshCw size={16} className="text-gray-500" />
            <span className="text-sm font-medium">Refresh Rate:</span>
            <select 
              value={refreshRate} 
              onChange={(e) => setRefreshRate(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-blue-600 outline-none cursor-pointer"
            >
              <option value={1000}>1s (Realtime)</option>
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        
        {/* LEFT COLUMN: RAW DATA TABLE */}
        <div className="bg-white p-6 rounded-lg shadow-md border h-[600px] flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
             Raw Data Stream
          </h2>
          <div className="flex-1 overflow-auto border rounded">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Temp</th>
                  <th className="px-4 py-2">Hum</th>
                  <th className="px-4 py-2">Bat</th>
                </tr>
              </thead>
              <tbody>
                {/* We reverse the array here to show newest first in the table */}
                {[...telemetry].reverse().map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-mono">{new Date(log.ts).toLocaleTimeString()}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{log.temperature.toFixed(1)}°C</td>
                    <td className="px-4 py-2">{log.humidity.toFixed(1)}%</td>
                    <td className="px-4 py-2">
                       <span className={log.battery < 20 ? 'text-red-600 font-bold' : 'text-green-600'}>
                         {log.battery}%
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: VISUAL DASHBOARD */}
        <div className="flex flex-col gap-6">
          
          {/* 1. BATTERY GAUGE */}
          <div className="bg-white p-6 rounded-lg shadow-md border flex items-center justify-between relative">
             <div>
                <h3 className="text-gray-500 font-bold uppercase text-xs mb-1">Battery Status</h3>
                <h2 className="text-4xl font-bold text-gray-800">{latest?.battery}%</h2>
                <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                   <Battery size={16} /> {latest && latest.battery < 20 ? 'Critical Level' : 'Healthy'}
                </p>
             </div>
             
             {/* The Fuel Gauge (Half Pie Chart) */}
             {/* The Fuel Gauge (Half Pie Chart) */}
             <div className="h-32 w-48 relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={batteryData}
                     cx="50%"
                     cy="100%"
                     startAngle={180}
                     endAngle={0}
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={0}
                     dataKey="value"
                     shape={(props: any) => (
                       <Sector 
                         {...props}           // Pass all geometry props (cx, cy, angles, etc.)
                         fill={props.payload.fill} // Use the color we defined in batteryData
                       />
                     )}
                   />
                   {/* No <Cell> components needed here anymore! */}
                 </PieChart>
               </ResponsiveContainer>
               
               {/* Needle Base Decoration */}
               <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
             </div>
          </div>

          {/* 2. TEMPERATURE GRAPH */}
          <div className="bg-white p-4 rounded-lg shadow-md border flex-1">
            <h3 className="text-gray-500 font-bold uppercase text-xs mb-4">Temperature (Last 5 Readings)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="ts" 
                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], {minute:'2-digit', second:'2-digit'})} 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis domain={['auto', 'auto']} fontSize={12} unit="°C" />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={false} // Disable animation for smoother live updates
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. HUMIDITY GRAPH */}
          <div className="bg-white p-4 rounded-lg shadow-md border flex-1">
            <h3 className="text-gray-500 font-bold uppercase text-xs mb-4">Humidity (Last 5 Readings)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="ts" 
                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], {minute:'2-digit', second:'2-digit'})} 
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis domain={[0, 100]} fontSize={12} unit="%" />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;