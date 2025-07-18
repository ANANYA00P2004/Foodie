import React, { useState } from 'react';
import { ChefHat, Users, UserCog, X } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const LandingPage = () => {
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const navigate = useNavigate();

  const handleUserLogin = () => {
    setShowUserLogin(true);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleGoogleLogin = (isAdmin = false) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const email = result.user.email;

        if (isAdmin) {
          // Admin login - check if email is authorized admin
          if (email === 'ananyanaran@gmail.com') {
            navigate('/admin');
          } else {
            alert("Unauthorized admin access. Please contact system administrator.");
          }
        } else {
          // User login - redirect based on email
          if (email === 'ananyanaran@gmail.com') {
            navigate('/admin');
          } else {
            navigate('/student');
          }
        }
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  };

  const closeModals = () => {
    setShowUserLogin(false);
    setShowAdminLogin(false);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <span className="logo-text">Foodie</span>
        </div>

        {/* Login Buttons */}
        <div className="login-buttons">
          <button
            onClick={handleUserLogin}
            className="login-btn user"
          >
            <Users className="h-5 w-5" />
            <span>Login as User</span>
          </button>
          <button
            onClick={handleAdminLogin}
            className="login-btn admin"
          >
            <UserCog className="h-5 w-5" />
            <span>Login as Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-container">
          {/* Left Side - Text Content */}
          <div className="left-content">
            <div className="content-wrapper">
              {/* Main Title */}
              <h1 className="main-title">
                Foodie
              </h1>

              {/* Subtitle */}
              <div className="subtitle-section">
                <p className="subtitle-main">
                  Prebook your meals and savor every bite with 
                  <span className="subtitle-accent"> Foodie</span> - 
                  the ultimate culinary companion for seamless meal reservations.
                </p>
                <p className="subtitle-secondary">
                  Experience the future of dining where convenience meets deliciousness. 
                  Skip the queues, secure your favorites, and let our chefs prepare 
                  exactly what you crave.
                </p>
              </div>

              {/* Features */}
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <ChefHat className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="feature-title">Pre-order Magic</h3>
                  <p className="feature-description">Reserve your favorite meals in advance and never miss out on what you love.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="feature-title">Smart Planning</h3>
                  <p className="feature-description">Help chefs prepare the perfect portions with accurate demand forecasting.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">
                    <UserCog className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="feature-title">Zero Waste</h3>
                  <p className="feature-description">Reduce food waste while ensuring fresh, delicious meals for everyone.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="right-content">
            <div className="image-container">
              <div className="image-blur-bg"></div>
              <div className="image-frame">
                <img
                  src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/463cd5fe-262f-46ab-b7db-e3c0558e8621/4b78c868-2408-49ce-9625-d9cbce0628cf.png"
                  alt="Delicious food spread"
                  className="main-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>

      {/* User Login Modal */}
      {showUserLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Student Login</h2>
              <button
                onClick={closeModals}
                className="modal-close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content-wrapper">
                <Users className="modal-icon" />
                <p className="modal-description">
                  Sign in with your Google account to access your meal booking dashboard
                </p>
              </div>
              <button
                onClick={() => handleGoogleLogin(false)}
                className="modal-button"
              >
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Admin Login</h2>
              <button
                onClick={closeModals}
                className="modal-close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content-wrapper">
                <UserCog className="modal-icon" />
                <p className="modal-description">
                  Administrative access for canteen management and meal planning
                </p>
              </div>
              <button
                onClick={() => handleGoogleLogin(true)}
                className="modal-button"
              >
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;