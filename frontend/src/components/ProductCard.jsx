import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await addToCart(product, 1);
    };

    const discount = product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <Link to={`/product/${product._id}`} className="product-card">
            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                {discount > 0 && (
                    <span className="product-discount">-{discount}%</span>
                )}
                {product.featured && (
                    <span className="product-featured">Featured</span>
                )}
                <button
                    className="quick-add-btn"
                    onClick={handleAddToCart}
                    aria-label="Add to cart"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add to Cart
                </button>
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>

                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
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
                    <span className="review-count">({product.numReviews})</span>
                </div>

                <div className="product-price-row">
                    <div className="product-prices">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                        <span className="low-stock">Only {product.stock} left</span>
                    )}
                    {product.stock === 0 && (
                        <span className="out-of-stock">Out of stock</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
