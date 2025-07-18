// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { ChefHat, Mail, Check, Clock, Users } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Adjust path according to your firebase config file
import './AdminDashboard.css';
import emailjs from 'emailjs-com'; // Add this at the top


const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(null);

  // Fetch bookings from Firebase
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        
        const bookingsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            userEmail: data.userEmail,
            bookingDate: data.bookingDate?.toDate ? data.bookingDate.toDate() : new Date(data.bookingDate),
            items: data.items || [],
            status: data.status || 'pending',
            totalAmount: data.totalAmount || 0,
            totalItems: data.totalItems || 0
          };
        });
        
        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate totals for each food type
  const calculateTotals = () => {
    const totals = { Meals: 0, Chai: 0, Snacks: 0 };
    
    bookings.forEach(booking => {
      if (booking.status === 'pending') {
        booking.items.forEach(item => {
          if (totals.hasOwnProperty(item.name)) {
            totals[item.name] += item.quantity;
          }
        });
      }
    });
    
    return totals;
  };

  // Get bookings for specific food type
  const getBookingsForType = (foodType) => {
    return bookings.filter(booking => 
      booking.status === 'pending' && 
      booking.items.some(item => item.name === foodType)
    );
  };

  // Send email notification function
  const sendEmailNotification = async (userEmail) => {
  try {
    const templateParams = {
      to_email: userEmail,
      name: 'Canteen Admin',
      time: new Date().toLocaleString(),
      subject: 'Your food is ready!',
      message: 'Hello! Your food order is ready for pickup from the canteen. Please collect it soon.',
    };

    await emailjs.send(
      'service_vm00e98',      // Your service ID
      'template_6a1zrjb',     // Your template ID
      templateParams,
      'GsJ-pU5oBQSB8e-vP'     // Your public API key
    );

    console.log(`Email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


  // Handle marking order as ready
  const handleMarkReady = async (bookingId, userEmail) => {
    setProcessingOrder(bookingId);
    
    try {
      // Update booking status in Firebase
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'ready',
        readyTime: new Date()
      });
      
      // Send email notification
      await sendEmailNotification(userEmail);
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'ready' }
            : booking
        )
      );
      
      // Show success message
      alert(`Notification sent to ${userEmail}! Food marked as ready.`);
      
    } catch (error) {
      console.error('Error marking order as ready:', error);
      alert('Failed to mark order as ready. Please try again.');
    } finally {
      setProcessingOrder(null);
    }
  };

  const totals = calculateTotals();

  const FoodCard = ({ foodType, iconClass }) => {
    const bookingsForType = getBookingsForType(foodType);
    const totalQuantity = totals[foodType];

    return (
      <div className="food-card">
        <div className="food-card-header">
          <div className="food-card-left">
            <div className={`food-icon-container ${iconClass}`}>
              <ChefHat className="food-icon" />
            </div>
            <div>
              <h3 className="food-title">{foodType}</h3>
              <p className="food-subtitle">Total: {totalQuantity} items</p>
            </div>
          </div>
          <div className="food-total">
            <div className="food-total-number">{totalQuantity}</div>
            <div className="food-total-text">to prepare</div>
          </div>
        </div>
        
        <div className="orders-list">
          {bookingsForType.length === 0 ? (
            <p className="no-orders">No pending orders</p>
          ) : (
            bookingsForType.map(booking => {
              const item = booking.items.find(item => item.name === foodType);
              return (
                <div key={booking.id} className="order-item">
                  <div className="order-header">
                    <div className="order-info">
                      <p className="order-email">{booking.userEmail}</p>
                      <p className="order-details">
                        Quantity: {item.quantity} • ₹{item.totalPrice}
                      </p>
                      <p className="order-time">
                        {booking.bookingDate.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkReady(booking.id, booking.userEmail)}
                      disabled={processingOrder === booking.id}
                      className="ready-button"
                    >
                      {processingOrder === booking.id ? (
                        <>
                          <div className="loading-spinner" style={{width: '1rem', height: '1rem', margin: 0}}></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="ready-button-icon" />
                          <span>Ready</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <ChefHat className="header-icon" />
              <h1 className="header-title">Admin Dashboard</h1>
            </div>
            <div className="header-date">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <Users className="stat-icon users" />
              <div>
                <p className="stat-text">Total Pending Orders</p>
                <p className="stat-number">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <Clock className="stat-icon clock" />
              <div>
                <p className="stat-text">Items to Prepare</p>
                <p className="stat-number">
                  {Object.values(totals).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <Mail className="stat-icon mail" />
              <div>
                <p className="stat-text">Ready Orders</p>
                <p className="stat-number">
                  {bookings.filter(b => b.status === 'ready').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Food Cards */}
        <div className="food-cards-grid">
          <FoodCard foodType="Meals" iconClass="meals" />
          <FoodCard foodType="Chai" iconClass="chai" />
          <FoodCard foodType="Snacks" iconClass="snacks" />
        </div>
      </div>
      <div className="summary-section">
  <h2 className="summary-title">Order Summary</h2>
  <div className="summary-table-container">
    <table className="summary-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Booking Time</th>
          <th>Items</th>
          <th>Total Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {bookings.length === 0 ? (
          <tr><td colSpan="5">No bookings available</td></tr>
        ) : (
          bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.userId || 'N/A'}</td>
              <td>{booking.userEmail}</td>
              <td>{booking.bookingDate.toLocaleString()}</td>
              <td>
                {booking.items.map((item, index) => (
                  <div key={index}>{item.name} x{item.quantity}</div>
                ))}
              </td>
              <td>{booking.totalAmount}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;