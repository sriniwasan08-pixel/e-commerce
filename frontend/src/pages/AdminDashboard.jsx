import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        ordersByStatus: []
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch('/api/orders/stats/summary', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                fetch('/api/orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setRecentOrders(ordersData.slice(0, 5));
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusCards = [
        { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#6366f1' },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: '#10b981' },
        { label: 'Products', value: '12+', icon: '🛍️', color: '#8b5cf6' },
        { label: 'Customers', value: '100+', icon: '👥', color: '#f59e0b' }
    ];

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">Welcome back, {user?.name}</p>
                </div>

                <div className="admin-nav">
                    <Link to="/admin" className="admin-nav-link active">Dashboard</Link>
                    <Link to="/admin/products" className="admin-nav-link">Products</Link>
                    <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
                </div>

                {loading ? (
                    <div className="loading">Loading dashboard...</div>
                ) : (
                    <>
                        <div className="stats-grid">
                            {statusCards.map((stat, index) => (
                                <div key={index} className="stat-card" style={{ '--accent': stat.color }}>
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-content">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h3 className="card-title">Recent Orders</h3>
                                    <Link to="/admin/orders" className="view-all">View All</Link>
                                </div>
                                <div className="orders-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                                                    <td>{order.user?.name || 'N/A'}</td>
                                                    <td>${order.totalPrice.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h3 className="card-title">Quick Actions</h3>
                                </div>
                                <div className="quick-actions">
                                    <Link to="/admin/products" className="action-btn">
                                        <span className="action-icon">➕</span>
                                        <span>Add Product</span>
                                    </Link>
                                    <Link to="/admin/orders" className="action-btn">
                                        <span className="action-icon">📋</span>
                                        <span>Manage Orders</span>
                                    </Link>
                                    <Link to="/products" className="action-btn">
                                        <span className="action-icon">👁️</span>
                                        <span>View Store</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
