import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './Orders.css';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const successOrderId = searchParams.get('success');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
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

    const getStatusColor = (status) => {
        const colors = {
            'Processing': 'status-processing',
            'Confirmed': 'status-confirmed',
            'Shipped': 'status-shipped',
            'Delivered': 'status-delivered',
            'Cancelled': 'status-cancelled'
        };
        return colors[status] || 'status-processing';
    };

    if (loading) {
        return (
            <div className="orders-page">
                <div className="container">
                    <h1 className="page-title">My Orders</h1>
                    <div className="loading-orders">Loading orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="container">
                <h1 className="page-title">My Orders</h1>

                {successOrderId && (
                    <div className="order-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <div>
                            <h3>Order placed successfully!</h3>
                            <p>Your order has been confirmed and will be processed soon.</p>
                        </div>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h2>No orders yet</h2>
                        <p>Start shopping to see your orders here</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="order-statuses">
                                        <span className={`order-status ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                        <span className={`payment-status ${order.paymentStatus === 'Completed' ? 'paid' : 'pending'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-details">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="shipping-info">
                                        <span className="shipping-label">Shipping to:</span>
                                        <span className="shipping-address">
                                            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </span>
                                    </div>
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <span className="total-amount">${order.totalPrice.toFixed(2)}</span>
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

export default Orders;
