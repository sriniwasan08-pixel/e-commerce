import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Fetch cart from server when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Load from localStorage for guest users
            const localCart = localStorage.getItem('guestCart');
            if (localCart) {
                setCart(JSON.parse(localCart));
            } else {
                setCart({ items: [] });
            }
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        if (!user?.token) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCart(data);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated && user?.token) {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ productId: product._id, quantity })
                });
                const data = await response.json();
                if (response.ok) {
                    setCart(data);
                    return { success: true };
                }
                return { success: false, error: data.message };
            } catch (error) {
                return { success: false, error: error.message };
            } finally {
                setLoading(false);
            }
        } else {
            // Guest cart - store in localStorage
            const newCart = { ...cart };
            const existingItem = newCart.items.find(item =>
                (item.product?._id || item.product) === product._id
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                newCart.items.push({ product, quantity });
            }

            setCart(newCart);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
            return { success: true };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (isAuthenticated && user?.token) {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/cart/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ productId, quantity })
                });
                const data = await response.json();
                if (response.ok) {
                    setCart(data);
                    return { success: true };
                }
                return { success: false, error: data.message };
            } catch (error) {
                return { success: false, error: error.message };
            } finally {
                setLoading(false);
            }
        } else {
            const newCart = { ...cart };
            const itemIndex = newCart.items.findIndex(item =>
                (item.product?._id || item.product) === productId
            );

            if (itemIndex > -1) {
                if (quantity <= 0) {
                    newCart.items.splice(itemIndex, 1);
                } else {
                    newCart.items[itemIndex].quantity = quantity;
                }
            }

            setCart(newCart);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
            return { success: true };
        }
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated && user?.token) {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/cart/remove/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setCart(data);
                    return { success: true };
                }
                return { success: false, error: data.message };
            } catch (error) {
                return { success: false, error: error.message };
            } finally {
                setLoading(false);
            }
        } else {
            const newCart = { ...cart };
            newCart.items = newCart.items.filter(item =>
                (item.product?._id || item.product) !== productId
            );
            setCart(newCart);
            localStorage.setItem('guestCart', JSON.stringify(newCart));
            return { success: true };
        }
    };

    const clearCart = async () => {
        if (isAuthenticated && user?.token) {
            try {
                setLoading(true);
                await fetch(`${API_BASE_URL}/api/cart/clear`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setCart({ items: [] });
            } catch (error) {
                console.error('Failed to clear cart:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setCart({ items: [] });
            localStorage.removeItem('guestCart');
        }
    };

    const getCartTotal = () => {
        return cart.items.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
