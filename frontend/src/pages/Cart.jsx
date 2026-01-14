import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        await updateQuantity(productId, newQuantity);
    };

    const handleRemove = async (productId) => {
        await removeFromCart(productId);
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    if (cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet</p>
                        <Link to="/products" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.items.map((item) => {
                            const product = item.product;
                            if (!product) return null;

                            return (
                                <div key={product._id} className="cart-item">
                                    <Link to={`/product/${product._id}`} className="cart-item-image">
                                        <img src={product.image} alt={product.name} />
                                    </Link>

                                    <div className="cart-item-details">
                                        <Link to={`/product/${product._id}`} className="cart-item-name">
                                            {product.name}
                                        </Link>
                                        <span className="cart-item-category">{product.category}</span>

                                        <div className="cart-item-price">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-selector">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                                                disabled={loading || item.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                                                disabled={loading || item.quantity >= product.stock}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(product._id)}
                                            disabled={loading}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        ${(product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3 className="summary-title">Order Summary</h3>

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

                        {subtotal < 100 && (
                            <div className="free-shipping-notice">
                                Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                            </div>
                        )}

                        <button
                            className="btn btn-primary checkout-btn"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            Proceed to Checkout
                        </button>

                        <Link to="/products" className="continue-shopping">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
