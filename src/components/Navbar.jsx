import React, { useState, useEffect, useCallback } from "react";
/* import { CoinContext } from "../context/CoinContext"; */
import { useAuth } from "../context/AuthContext";
/* import { useTheme } from "../context/ThemeContext"; */
import { Link, useNavigate, useLocation } from "react-router-dom";

import { FiMenu, FiX, FiUser, FiLogOut,FiLock } from "react-icons/fi"; // Added react-icons for cleaner UI
import "./Navbar.css";

function Navbar() {
  /* const { setCurrency } = useContext(CoinContext); */
  const { currentUser, logout ,isEmailProvider } = useAuth();
  /* const { theme } = useTheme(); */
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDashboardPage = location.pathname === "/dashboard";

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* 
  const currencies = [
    { label: "USD", value: "usd", symbol: "$" },
    { label: "EUR", value: "eur", symbol: "€" },
    { label: "INR", value: "inr", symbol: "₹" },
  ];
  */

  /*
  const currencyHandler = useCallback((currency) => {
    setCurrency({ name: currency.value, Symbol: currency.symbol });
  }, [setCurrency]);
  */

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logout, navigate]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" }, // Renamed for professionalism
    { to: "/features", label: "Features" },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo-wrapper">
            <img src="/crypto-logo.png" alt="CryptoHub" className="logo-img" />
          </div>
          <span className="logo-text">CryptoHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-only">
          {!isDashboardPage && (
            <>
              {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? "active" : ""}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>

        <div className="nav-right desktop-only">
          {/* Currency Selector Removed as per request */}

          {currentUser ? (
            <div className="user-menu">
              <span className="user-email">{currentUser.email}</span>

               {/* Change Password - Only for email/password users */}
                {isEmailProvider() && (
                  <Link 
                    to="/change-password" 
                    className="icon-btn" 
                    title="Change Password"
                  >
                    <FiLock />
                  </Link>
                )}

              <button onClick={handleLogout} className="icon-btn" title="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-glass-nav">Log In</Link>
              <Link to="/signup" className="btn-neon">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass-panel">
          <ul className="mobile-nav-links">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={location.pathname === link.to ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-actions">
            {!currentUser && (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </>
            )}
           {currentUser && (
          <>
            {isEmailProvider() && (
              <Link 
                to="/change-password" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-text"
              >
                Change Password
              </Link>
            )}
            <button onClick={handleLogout} className="btn-text">Logout</button>
          </>
        )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;