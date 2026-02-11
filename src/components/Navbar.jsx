import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiUser, FiLogOut, FiMail } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
 

  const isDashboardPage = location.pathname === "/dashboard";

  const handleDropdownEnter = (label) => {
  setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    setOpenDropdown(null);
    };

  const handleDropdownClick = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };


  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.navbar-item')) {
        setOpenDropdown(null);
      }
      if (isProfileOpen && !event.target.closest('.profile-menu-container')) {
        setIsProfileOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (openDropdown) setOpenDropdown(null);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openDropdown, isProfileOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [logout, navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    {
      label: "More",
      dropdown:[
    { to: "/contributors", label: "Contributors" },
    { to: "/contactus", label: "Contact Us" },
    { to: "/faq", label: "FAQ" },
      ],
    }
    
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""} ${isMobileMenuOpen ? "has-mobile-menu" : ""} ${isDashboardPage ? "is-dashboard" : ""}`}
    >
      <div className="navbar-content">
        {/* Brand/Logo Section */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <img src="/crypto-logo.png" alt="CryptoHub" className="logo-img" />
          </div>
          <span className="logo-text">CryptoHub</span>
        </Link>

        {/* Desktop Navigation Menu */}
        {!isDashboardPage && (
    <ul className="navbar-menu">
      {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
        <li
          key={link.label}
          className="navbar-item"
          onMouseEnter={() => link.dropdown && handleDropdownEnter(link.label)}
          onMouseLeave={handleDropdownLeave}
        >
          {link.dropdown ? (
            <>
              <span 
                className="navbar-link dropdown-trigger"
                onClick={() => handleDropdownClick(link.label)}
                role="button"
                aria-expanded={openDropdown === link.label}
                aria-haspopup="true"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDropdownClick(link.label);
                  }
                }}
              >
                {link.label}
              </span>

              <ul 
                className={`dropdown-menu ${openDropdown === link.label ? 'show' : ''}`}
                role="menu"
                aria-label={`${link.label} submenu`}
              >
                {link.dropdown.map((item) => (
                  <li key={item.to} role="none">
                    <Link
                      to={item.to}
                      className="dropdown-link"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              to={link.to}
              className={`navbar-link ${
                location.pathname === link.to ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>

        )}

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Desktop Auth Buttons/User Menu */}
          <div className="desktop-auth">
            {currentUser ? (
              <div className="profile-menu-container">
                <button 
                  className="profile-icon-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User profile menu"
                  aria-expanded={isProfileOpen}
                >
                  <FiUser />
                </button>
                
                <div className={`profile-dropdown ${isProfileOpen ? 'show' : ''}`}>
                  <div className="profile-dropdown-header">
                    <FiMail className="profile-icon" />
                    <span className="profile-email">{currentUser.email}</span>
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <div className="profile-dropdown-items">
                    {isEmailProvider() && (
                      <Link
                        to="/change-password"
                        className="profile-dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiLock />
                        <span>Change Password</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }} 
                      className="profile-dropdown-item logout-item"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-btn navbar-btn-login">
                  LOGIN
                </Link>
                <Link to="/signup" className="navbar-btn navbar-btn-signup">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`navbar-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isDashboardPage && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            {(currentUser ? authenticatedNavLinks : navLinks).map((link) => (
              <li key={link.label} className="mobile-menu-item">
                {link.dropdown ? (
                  <>
                    <span 
                      className="mobile-menu-link"
                      onClick={() => handleDropdownClick(link.label)}
                    >
                      {link.label}
                    </span>
                    {openDropdown === link.label && (
                      <ul className="mobile-dropdown-menu">
                        {link.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              className="mobile-dropdown-link"
                              onClick={closeMobileMenu}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`mobile-menu-link ${
                      location.pathname === link.to ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          {!currentUser && (
            <div className="mobile-auth">
              <Link
                to="/login"
                className="navbar-btn navbar-btn-login"
                onClick={closeMobileMenu}
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="navbar-btn navbar-btn-signup"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
