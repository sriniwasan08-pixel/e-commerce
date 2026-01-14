import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const updates = {
            name: formData.name,
            email: formData.email
        };

        if (formData.password) {
            updates.password = formData.password;
        }

        const result = await updateProfile(updates);

        if (result.success) {
            setSuccess('Profile updated successfully');
            setFormData({ ...formData, password: '', confirmPassword: '' });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <h1 className="page-title">My Profile</h1>

                <div className="profile-layout">
                    <div className="profile-sidebar">
                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h2 className="profile-name">{user?.name}</h2>
                        <p className="profile-email">{user?.email}</p>
                        {user?.isAdmin && (
                            <span className="admin-badge">Admin</span>
                        )}
                    </div>

                    <div className="profile-content">
                        <div className="profile-card">
                            <h3 className="card-title">Account Settings</h3>

                            {success && (
                                <div className="alert alert-success">{success}</div>
                            )}
                            {error && (
                                <div className="alert alert-error">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-divider">
                                    <span>Change Password (optional)</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary update-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
