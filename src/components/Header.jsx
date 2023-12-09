import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Header.css'

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const auth = useAuth()
  const navigate = useNavigate() 

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
  
  const handleSignout = async () => {
    await auth.SignOut()
    navigate('/')
  }


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
                    <div className='unauth-nav-bar'>
                        <Link to="/" style={{textDecoration: 'none'}}>
                            <div className='logo-wrapper'> 
                                <p>Neat <span>List</span></p>
                            </div>
                        </Link>
                        <div className='auth-nav-links'>
                        
                            <a href="#third-section" onClick={(e) => handleClick(e, 'third-section')}>Features</a>
                            <a href="#fourth-section" onClick={(e) => handleClick(e, 'fourth-section')}>About</a>
                            <Link to='/Dashboard'>Dashboard</Link>
                            <div className="dropdown">
                              <button onClick={toggleDropdown} className="dropbtn">
                                Profile
                              </button>
                              {isOpen && (
                                <div className="dropdown-content">
                                  <p>{auth.currentUser.email}</p>
                                  <button onClick={()=>handleSignout()}>Logout</button>
                                </div>
                              )}
                            </div>
                            
                        </div>
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