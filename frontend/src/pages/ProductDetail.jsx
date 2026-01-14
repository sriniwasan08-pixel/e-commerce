import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const result = await addToCart(product, quantity);
        if (result.success) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleBuyNow = async () => {
        await addToCart(product, quantity);
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=checkout');
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="product-detail-skeleton">
                        <div className="skeleton skeleton-image-lg"></div>
                        <div className="skeleton-info">
                            <div className="skeleton skeleton-title"></div>
                            <div className="skeleton skeleton-text"></div>
                            <div className="skeleton skeleton-text"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="not-found">
                        <h2>Product not found</h2>
                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const allImages = [product.image, ...(product.images || [])];
    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="product-detail">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={allImages[activeImage]} alt={product.name} />
                            {discount > 0 && (
                                <span className="discount-badge">-{discount}%</span>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="thumbnail-list">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </div>
                            <span className="rating-text">{product.rating} ({product.numReviews} reviews)</span>
                        </div>

                        <div className="product-pricing">
                            <span className="current-price">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                            )}
                            {discount > 0 && (
                                <span className="savings">You save ${(product.originalPrice - product.price).toFixed(2)}</span>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="product-meta">
                            {product.brand && (
                                <div className="meta-item">
                                    <span className="meta-label">Brand:</span>
                                    <span className="meta-value">{product.brand}</span>
                                </div>
                            )}
                            <div className="meta-item">
                                <span className="meta-label">Availability:</span>
                                <span className={`meta-value ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        {product.stock > 0 && (
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`btn btn-secondary add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button className="btn btn-primary buy-now-btn" onClick={handleBuyNow}>
                                    Buy Now
                                </button>
                            </div>
                        )}

                        <div className="product-features">
                            <div className="feature">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13"></rect>
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                </svg>
                                Free shipping on orders over $100
                            </div>
                            <div className="feature">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                </svg>
                                30-day easy returns
                            </div>
                            <div className="feature">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                Secure payment
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
