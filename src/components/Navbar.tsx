import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import API from '../api/axiosConfig';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the backend logout route
            await API.post('/auth/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // Always clear local state and redirect
            logout();
            navigate('/login');
        }
    };

    // Don't show Navbar if user is not logged in
    if (!user) return null;

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* LEFT: Profile Link */}
                    <div className="flex-shrink-0">
                        <Link to={`/profile/${user.id}`} className="flex items-center hover:text-blue-200 transition">
                            <User size={24} />
                            <span className="ml-2 text-sm font-medium hidden sm:block">My Profile</span>
                        </Link>
                    </div>

                    {/* CENTER: Title */}
                    <div className="flex-grow text-center">
                        <Link to="/dashboard" className="text-xl font-bold tracking-wide hover:text-blue-100">
                            IoT Telemetry Platform
                        </Link>
                    </div>

                    {/* RIGHT: Logout Button */}
                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center hover:text-red-300 transition"
                            title="Logout"
                        >
                            <span className="mr-2 text-sm font-medium hidden sm:block">Logout</span>
                            <LogOut size={24} />
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;