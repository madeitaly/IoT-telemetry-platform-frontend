export interface Telemetry {
  id: number;
  deviceId: number;
  ts: string; // Timestamp
  payload: {
    status: string;
    firmware: string;
  };
  temperature: number;
  humidity: number;
  battery: number;
}