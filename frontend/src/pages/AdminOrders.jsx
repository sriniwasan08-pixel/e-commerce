import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './Admin.css';

const AdminOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ orderStatus, paymentStatus })
            });

            if (response.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to update order:', error);
        }
    };

    const orderStatuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentStatuses = ['Pending', 'Completed', 'Failed', 'Refunded'];

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1 className="page-title">Manage Orders</h1>
                </div>

                <div className="admin-nav">
                    <Link to="/admin" className="admin-nav-link">Dashboard</Link>
                    <Link to="/admin/products" className="admin-nav-link">Products</Link>
                    <Link to="/admin/orders" className="admin-nav-link active">Orders</Link>
                </div>

                {loading ? (
                    <div className="loading">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="no-data">No orders found</div>
                ) : (
                    <div className="orders-list admin-orders">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card admin-order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className="order-total-badge">
                                        ${order.totalPrice.toFixed(2)}
                                    </div>
                                </div>

                                <div className="order-details">
                                    <div className="customer-info">
                                        <span className="label">Customer:</span>
                                        <span>{order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})</span>
                                    </div>
                                    <div className="shipping-info">
                                        <span className="label">Ship to:</span>
                                        <span>
                                            {order.shippingAddress.fullName}, {order.shippingAddress.street},
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </span>
                                    </div>
                                    <div className="items-summary">
                                        <span className="label">Items:</span>
                                        <span>{order.items.length} item(s)</span>
                                    </div>
                                </div>

                                <div className="order-items compact">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item-mini">
                                            <img src={item.image} alt={item.name} />
                                            <span>{item.name} × {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-actions">
                                    <div className="status-control">
                                        <label>Order Status:</label>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                                            className="form-input status-select"
                                        >
                                            {orderStatuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="status-control">
                                        <label>Payment:</label>
                                        <select
                                            value={order.paymentStatus}
                                            onChange={(e) => updateOrderStatus(order._id, order.orderStatus, e.target.value)}
                                            className="form-input status-select"
                                        >
                                            {paymentStatuses.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
