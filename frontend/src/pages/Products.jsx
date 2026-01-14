import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API_BASE_URL from '../config/api';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const category = searchParams.get('category') || 'All';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [category, search, sort, page]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/categories`);
            const data = await response.json();
            setCategories(['All', ...data]);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...(category !== 'All' && { category }),
                ...(search && { search }),
                sort,
                page
            });

            const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
            const data = await response.json();
            setProducts(data.products);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'All' && value !== 'newest') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== 'page') {
            newParams.delete('page');
        }
        setSearchParams(newParams);
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Top Rated' }
    ];

    return (
        <div className="products-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">
                        {category !== 'All' ? category : 'All Products'}
                    </h1>
                    <p className="page-subtitle">
                        Discover our collection of premium products
                    </p>
                </div>

                <div className="products-layout">
                    {/* Sidebar */}
                    <aside className="products-sidebar">
                        <div className="filter-section">
                            <h3 className="filter-title">Categories</h3>
                            <div className="filter-options">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`filter-btn ${category === cat ? 'active' : ''}`}
                                        onClick={() => updateFilter('category', cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Sort By</h3>
                            <select
                                className="form-input sort-select"
                                value={sort}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="products-main">
                        <div className="products-toolbar">
                            <div className="search-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="search-input"
                                    value={search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                />
                            </div>
                            <span className="products-count">
                                {products.length} products found
                            </span>
                        </div>

                        {loading ? (
                            <div className="products-grid">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="product-skeleton">
                                        <div className="skeleton skeleton-image"></div>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text-sm"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-secondary"
                                            disabled={page === 1}
                                            onClick={() => updateFilter('page', page - 1)}
                                        >
                                            Previous
                                        </button>
                                        <span className="page-info">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary"
                                            disabled={page === totalPages}
                                            onClick={() => updateFilter('page', page + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-products">
                                <div className="no-products-icon">📦</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
