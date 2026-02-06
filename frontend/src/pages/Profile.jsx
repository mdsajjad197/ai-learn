import { Input } from '../components/UI';
import { Phone, Lock, Edit2, Save as SaveIcon, X } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser) {
            setUser(currentUser);
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                password: ''
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            authService.logout();
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await authService.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' })); // Clear password
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-heading font-bold text-gray-900">My Profile</h1>
                {!isEditing && (
                    <Button
                        text="Edit Profile"
                        variant="outline"
                        icon={<Edit2 size={16} />}
                        onClick={() => setIsEditing(true)}
                    />
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-32 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 bg-white rounded-full p-2 shadow-md">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={40} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    id="name"
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                />
                                <Input
                                    id="email"
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                />
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-shadow sm:text-sm"
                                        placeholder="Min 6 chars to change"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    text="Cancel"
                                    variant="outline"
                                    icon={<X size={16} />}
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                            phone: user.phone || '',
                                            password: ''
                                        });
                                    }}
                                />
                                <Button
                                    type="submit"
                                    text={loading ? "Saving..." : "Save Changes"}
                                    variant="primary"
                                    disabled={loading}
                                    icon={<SaveIcon size={16} />}
                                />
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <User className="text-teal-500" size={20} />
                                    {user?.name || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Mail className="text-teal-500" size={20} />
                                    {user?.email || 'N/A'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
                                <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Phone className="text-teal-500" size={20} />
                                    {user?.phone || 'Not Verified'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account Role</label>
                                <div className="flex items-center gap-3 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <Shield className="text-teal-500" size={20} />
                                    <span className="capitalize">{user?.role || 'User'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isEditing && (
                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                            <Button
                                text="Sign Out"
                                onClick={handleLogout}
                                variant="danger"
                                icon={<LogOut size={18} />}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
