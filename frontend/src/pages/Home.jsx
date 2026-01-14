import { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroBackground3D from '../components/HeroBackground3D';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch('/api/products/featured');
            const data = await response.json();
            setFeaturedProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'Electronics', icon: '📱', color: '#6366f1' },
        { name: 'Clothing', icon: '👕', color: '#8b5cf6' },
        { name: 'Sports', icon: '⚽', color: '#10b981' },
        { name: 'Beauty', icon: '💄', color: '#ec4899' },
        { name: 'Home & Garden', icon: '🏠', color: '#f59e0b' },
        { name: 'Books', icon: '📚', color: '#3b82f6' }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <Suspense fallback={null}>
                    <HeroBackground3D />
                </Suspense>
                <div className="container hero-container">
                    <div className="hero-content">
                        <span className="hero-badge">✨ New Arrivals</span>
                        <h1 className="hero-title">
                            Discover Premium
                            <span className="text-gradient"> Products</span>
                        </h1>
                        <p className="hero-description">
                            Shop the latest trends with exclusive deals and free shipping on orders over $100.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                                View Featured
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-value">10K+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">50K+</span>
                                <span className="stat-label">Customers</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">4.9</span>
                                <span className="stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-grid">
                            <div className="hero-image hero-image-1">
                                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" alt="Headphones" />
                            </div>
                            <div className="hero-image hero-image-2">
                                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" alt="Watch" />
                            </div>
                            <div className="hero-image hero-image-3">
                                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Shoes" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">Browse our wide range of categories</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/products?category=${category.name}`}
                                className="category-card"
                                style={{ '--accent-color': category.color }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/products" className="section-link">
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </Link>
                    </div>
                    {loading ? (
                        <div className="products-grid">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="product-skeleton">
                                    <div className="skeleton skeleton-image"></div>
                                    <div className="skeleton skeleton-text"></div>
                                    <div className="skeleton skeleton-text-sm"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3 className="feature-title">Free Shipping</h3>
                            <p className="feature-text">On orders over $100</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3 className="feature-title">Easy Returns</h3>
                            <p className="feature-text">30-day return policy</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure Payment</h3>
                            <p className="feature-text">100% secure checkout</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3 className="feature-title">24/7 Support</h3>
                            <p className="feature-text">Dedicated support team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2 className="cta-title">Join Our Newsletter</h2>
                            <p className="cta-text">Get exclusive offers, new arrivals and more!</p>
                        </div>
                        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input cta-input"
                            />
                            <button type="submit" className="btn btn-primary">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
