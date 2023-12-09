import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import './UnauthHeader.css'
const UnauthHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()

  const handleClick = (e, sectionId) => {
    if (location.pathname !== `/`) {
      e.preventDefault();
      navigate('/')
      
    } else {
      const section = document.getElementById(sectionId);
      navigate(`/`)
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
  return (
    <>
        <div className='unauth-header-container' style={{ backgroundColor: scrolled ? '#23252b' : 'transparent', height: '70px', width: '100%', position: 'fixed', top: 0, left: 0 }}>
            <div className='unauth-nav-bar'>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <div className='logo-wrapper'> 
                        <p>Neat <span>List</span></p>
                    </div>
                </Link>
                <div className='nav-links'>
                    <a href="#third-section" onClick={(e) => handleClick(e, 'third-section')}>Features</a>
                    <a href="#fourth-section" onClick={(e) => handleClick(e, 'fourth-section')}>About</a>
                </div>
            </div>
        </div>
    </>
  )
}

export default UnauthHeader