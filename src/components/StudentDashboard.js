import React, { useState, useEffect } from 'react';
import { ChefHat, User, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase/firebase'; // Adjust path as needed
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';

import { onAuthStateChanged } from 'firebase/auth';
import './studentdashboard.css';
//import { collection, addDoc getDocs, serverTimestamp } from 'firebase/firestore';

const StudentDashboard = () => {
  const [quantities, setQuantities] = useState({
    meals: 0,
    chai: 0,
    snacks: 0
  });
  const [userBookings, setUserBookings] = useState([]);

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  //for displaying 
  useEffect(() => {
  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      const q = collection(db, 'bookings');
      const snapshot = await getDocs(q);

      const filteredBookings = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.userId === user.uid);

      setUserBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  fetchUserBookings();
}, [user]);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
    });

    return () => unsubscribe();
  }, []);

  // Test Firestore connection on component mount
  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        // Test if we can access Firestore
        const testCollection = collection(db, 'test');
        console.log('Firestore connection successful');
      } catch (error) {
        console.error('Firestore connection failed:', error);
      }
    };

    if (!authLoading) {
      testFirestoreConnection();
    }
  }, [authLoading]);

  const menuItems = {
    meals: {
      name: 'Meals',
      price: 40,
      image: 'https://rakskitchen.net/wp-content/uploads/2013/08/9634876480_20d7ac8196_o.jpg',
      description: 'Complete meal with rice, dal, vegetables, and more'
    },
    chai: {
      name: 'Chai',
      price: 10,
      image: 'https://www.honeywhatscooking.com/wp-content/uploads/2019/04/Kadak-Masala-Chai-3.jpg',
      description: 'Fresh masala chai made with aromatic spices'
    },
    snacks: {
      name: 'Snacks',
      price: 20,
      priceRange: '₹20',
      image: 'https://img.freepik.com/premium-photo/assortment-crispy-potato-chips-pretzels-isolated-white-background_829699-20259.jpg?semt=ais_hybrid&w=740',
      description: 'Variety of crispy snacks and light bites'
    }
  };
  const handleDeleteBooking = async (bookingId) => {
  if (!window.confirm('Are you sure you want to delete this booking?')) return;

  try {
    await deleteDoc(doc(db, 'bookings', bookingId));
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    alert('Booking deleted successfully.');
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('Failed to delete booking. Please try again.');
  }
};

  const handleCardClick = (itemKey) => {
    setSelectedItem(itemKey);
    setShowQuantityModal(true);
  };

  const updateQuantity = (action) => {
    if (!selectedItem) return;
    
    setQuantities(prev => ({
      ...prev,
      [selectedItem]: action === 'increase' 
        ? prev[selectedItem] + 1 
        : Math.max(0, prev[selectedItem] - 1)
    }));
  };

  const closeModal = () => {
    setShowQuantityModal(false);
    setSelectedItem(null);
  };

  const getTotalAmount = () => {
    return quantities.meals * menuItems.meals.price + 
           quantities.chai * menuItems.chai.price + 
           quantities.snacks * menuItems.snacks.price;
  };

  const getTotalItems = () => {
    return quantities.meals + quantities.chai + quantities.snacks;
  };

  // Function to handle booking submission
  const handleProceedToBooking = async () => {
    console.log('Booking process started');
    console.log('User:', user);
    console.log('Database:', db);

    if (!user) {
      alert('Please log in to place a booking');
      return;
    }

    if (getTotalItems() === 0) {
      alert('Please select at least one item');
      return;
    }

    setLoading(true);

    try {
      // Prepare booking data
      const bookingItems = [];
      
      // Add selected items to booking
      Object.entries(quantities).forEach(([key, quantity]) => {
        if (quantity > 0) {
          bookingItems.push({
            name: menuItems[key].name,
            quantity: quantity,
            pricePerItem: menuItems[key].price,
            totalPrice: quantity * menuItems[key].price
          });
        }
      });

      const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        items: bookingItems,
        totalAmount: getTotalAmount(),
        totalItems: getTotalItems(),
        bookingDate: serverTimestamp(),
        status: 'pending'
      };

      console.log('Booking data prepared:', bookingData);

      // Add booking to Firestore
      console.log('Attempting to add document to Firestore...');
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      console.log('Booking created with ID: ', docRef.id);
      
      // Show success message
      setBookingSuccess(true);
      
      // Reset quantities
      setQuantities({
        meals: 0,
        chai: 0,
        snacks: 0
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding booking: ', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // More specific error messages
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please check your Firestore security rules.');
      } else if (error.code === 'unavailable') {
        alert('Firestore is currently unavailable. Please try again later.');
      } else {
        alert(`Error placing booking: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 className="animate-spin h-8 w-8" />
          <span style={{ marginLeft: '10px' }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Debug Info - Remove in production
      {process.env.NODE_ENV === 'development' && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px', borderRadius: '5px' }}>
          <strong>Debug Info:</strong>
          <br />
          User: {user ? user.email : 'Not logged in'}
          <br />
          Database: {db ? 'Connected' : 'Not connected'}
        </div>
      )} */}

      {/* Success Message */}
      {bookingSuccess && (
        <div className="success-message">
          <div className="success-content">
            ✅ Booking placed successfully!
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-icon">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="logo-text">Foodie</span>
            </div>

            {/* User Profile */}
            <div className="user-profile">
              <div className="user-icon">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              {user && (
                <span className="user-name">
                  {user.displayName || user.email.split('@')[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="header-section">
          <h1 className="header-title">Welcome to Your Dashboard</h1>
          <p className="header-subtitle">Pre-book your favorite meals, chai, and snacks</p>
        </div>

        {/* Menu Cards */}
        <div className="menu-grid">
          {Object.entries(menuItems).map(([key, item]) => (
            <div
              key={key}
              onClick={() => handleCardClick(key)}
              className="menu-card"
            >
              <div className="card-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image"
                />
                <div className="price-badge">
                  {item.priceRange || `₹${item.price}`}
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-description">{item.description}</p>
                
                <div className="card-footer">
                  <span className="card-price">
                    {item.priceRange || `₹${item.price}`}
                  </span>
                  {quantities[key] > 0 && (
                    <div className="quantity-badge">
                      {quantities[key]} selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="cart-summary">
            <div className="cart-header">
              <h2 className="cart-title">
                <ShoppingCart className="cart-icon h-6 w-6" />
                Order Summary
              </h2>
              <div className="cart-total-section">
                <p className="cart-items-count">{getTotalItems()} items</p>
                <p className="cart-total-amount">₹{getTotalAmount()}</p>
              </div>
            </div>
            
            <div className="cart-items">
              {Object.entries(quantities).map(([key, qty]) => (
                qty > 0 && (
                  <div key={key} className="cart-item">
                    <span className="cart-item-name">{menuItems[key].name} x {qty}</span>
                    <span className="cart-item-price">₹{qty * menuItems[key].price}</span>
                  </div>
                )
              ))}
            </div>
            
            <button 
              className="proceed-button"
              onClick={handleProceedToBooking}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                'Proceed to Booking'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Quantity Modal */}
      {showQuantityModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <img
                src={menuItems[selectedItem].image}
                alt={menuItems[selectedItem].name}
                className="modal-image"
              />
              <h3 className="modal-title">
                {menuItems[selectedItem].name}
              </h3>
              <p className="modal-price">
                {menuItems[selectedItem].priceRange || `₹${menuItems[selectedItem].price}`}
              </p>
            </div>

            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity('decrease')}
                className="quantity-button quantity-decrease"
              >
                <Minus className="h-6 w-6" />
              </button>
              
              <div className="quantity-display">
                {quantities[selectedItem]}
              </div>
              
              <button
                onClick={() => updateQuantity('increase')}
                className="quantity-button quantity-increase"
              >
                <Plus className="h-6 w-6" />
              </button>
            </div>

            <div className="modal-total">
              <p className="modal-total-label">Total Amount</p>
              <p className="modal-total-amount">
                ₹{quantities[selectedItem] * menuItems[selectedItem].price}
              </p>
            </div>

            <div className="modal-buttons">
              <button
                onClick={closeModal}
                className="modal-button modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={closeModal}
                className="modal-button modal-confirm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Bookings Section */}
{userBookings.length > 0 && (
  <div className="bookings-section">
    <h2 className="section-title">Your Previous Bookings</h2>
    <div className="bookings-list">
      {userBookings.map((booking) => (
        <div key={booking.id} className="booking-card">
          <h4>{booking.bookingDate?.toDate?.().toLocaleString() || 'Booking'}</h4>
          <ul>
            {booking.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} = ₹{item.totalPrice}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ₹{booking.totalAmount}</p>
<p>Status: <em>{booking.status}</em></p>
<button
  className="delete-booking-button"
  onClick={() => handleDeleteBooking(booking.id)}
>
  Delete Booking
</button>

        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default StudentDashboard;