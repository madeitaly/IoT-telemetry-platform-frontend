export interface Device {
  id: number;
  serial: string;
  name: string;
  location: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  lastSeen: string | null; // It can be null based on your JSON
}