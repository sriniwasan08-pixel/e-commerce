import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './Checkout.css';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        paymentMethod: 'Credit Card'
    });

    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    shippingAddress: {
                        fullName: formData.fullName,
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                        phone: formData.phone
                    },
                    paymentMethod: formData.paymentMethod
                })
            });

            if (response.ok) {
                const order = await response.json();
                await clearCart();
                navigate(`/orders?success=${order._id}`);
            }
        } catch (error) {
            console.error('Failed to place order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <form className="checkout-layout" onSubmit={handleSubmit}>
                    <div className="checkout-form">
                        <div className="checkout-section">
                            <h2 className="section-title">Shipping Address</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    className="form-input"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        className="form-input"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        className="form-input"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="form-input"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="checkout-section">
                            <h2 className="section-title">Payment Method</h2>

                            <div className="payment-options">
                                {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                                    <label key={method} className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={formData.paymentMethod === method}
                                            onChange={handleChange}
                                        />
                                        <span className="payment-label">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="order-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="order-item">
                                    <img src={item.product.image} alt={item.product.name} />
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.product.name}</span>
                                        <span className="order-item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="order-item-price">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (18%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
