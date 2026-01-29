import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Mail } from 'lucide-react'; // Icons for visual appeal

interface UserProfile {
    id: number;
    email: string;
    createdAt: string;
    // Add other fields if your API sends name, etc.
}

const ProfilePage = () => {
    const { userId } = useParams(); // URL parameter
    const { user } = useAuth(); // Logged in user context
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Security check: Prevent viewing other users' profiles (optional)
        if (user && user.id.toString() !== userId) {
           // You might want to allow this for admins, but for now:
           // console.warn("Viewing another user's profile");
        }

        const fetchProfile = async () => {
            try {
                // Requirement 1: GET /api/profile/${userId}
                const res = await API.get(`/api/profile/${userId}`);
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                alert("Could not load profile data.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchProfile();
    }, [userId, navigate, user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start pt-20">
            <div className="bg-white max-w-md w-full rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 text-blue-600">
                        <User size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">User Profile</h2>
                    <p className="text-blue-200 text-sm">ID: {profile.id}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-4">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Email Address</p>
                            <p className="text-gray-800 font-medium">{profile.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="p-2 bg-green-100 rounded-full text-green-600 mr-4">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Member Since</p>
                            <p className="text-gray-800 font-medium">
                                {new Date(profile.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t text-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;