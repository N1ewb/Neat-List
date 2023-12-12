import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext';
import './Header.css'

import NeatlistLogo from '../images/neatlist-transparent.png'
import MenuIcon from '../images/icons8-menu-white-50.png'

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleClick = (e, sectionId) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      window.location.href = '/'; 
      
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 500) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  return (
    <>
        <AuthProvider>
        <div className='auth-header-container'>
            <div className='auth-nav-bar'>
                <div className='logo-wrapper'>

                </div>
                <div className="spacer"></div>
                <div className='nav-links'>
                  <div className='unauth-header-container' style={{ backgroundColor: scrolled ? '#23252b' : 'transparent', height: '70px', width: '100%', position: 'fixed', top: 0, left: 0 }}>
                  <Link to="/" style={{ textDecoration: "none" }}>
                        <div className="logo-wrapper-header">
                          <img src={NeatlistLogo} alt="neatlist" width="150px" />
                        </div>
                      </Link>
                  <div className="unauth-nav-bar">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <div className="logo-wrapper">
                        <img src={NeatlistLogo} alt="neatlist" width="150px" />
                      </div>
                    </Link>
                    <div className="auth-nav-links-always-open">
                      
                         <Link to="/Dashboard" style={{borderBottom:'1px solid white'}}>Dashboard</Link>
                        <a  href="#third-section" onClick={(e) => handleClick(e, "third-section")}>
                          Features
                        </a>
                        <a href="#fourth-section" onClick={(e) => handleClick(e, "fourth-section")}>
                          About
                        </a>
                       
                      </div>
                    <div
                      className="header-dropdown-menu"
                      onClick={toggleDropdown}
                    >
                      <img src={MenuIcon} alt='menu' height='30px' />
                    </div>

                    {isOpen && ( // Display links only when menu is open
                      <div className="auth-nav-links">
                         <Link to="/Dashboard" style={{borderBottom:'1px solid white'}}>Dashboard</Link>
                        <a  href="#third-section" onClick={(e) => handleClick(e, "third-section")}>
                          Features
                        </a>
                        <a href="#fourth-section" onClick={(e) => handleClick(e, "fourth-section")}>
                          About
                        </a>
                       
                      </div>
                    )}
                  </div>

                  </div>
                </div>
            </div>
        </div>
        </AuthProvider>
    </>
  )
}

export default Header