import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import NeatlistLogo from '../images/neatlist-transparent.png'
import MenuIcon from '../images/icons8-menu-white-50.png'

import './UnauthHeader.css'
const UnauthHeader = ({t, languages}) => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const [lang, setLang] = useState("en");
    const handleChange = (e) => {
      e.preventDefault()
      setLang(e.target.value);
      let loc = "http://localhost:3000";
      window.location.replace(
          loc + "?lng=" + e.target.value
      );
    };
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
                        <a  href="#third-section" onClick={(e) => handleClick(e, "third-section")}>
                          {t('features')}
                        </a>
                        <a href="#fourth-section" onClick={(e) => handleClick(e, "fourth-section")}>
                          {t('about_link')}
                        </a>
                        <Link to='LoginPage'>{t('login')}</Link>
                        <Link to='SignupPage'>{t('signup')}</Link>
                        <select value={lang} onChange={handleChange}>
                          {languages.map((item) => {
                              return (
                                  <option
                                      key={item.value}
                                      value={item.value}
                                  >
                                      {item.text}
                                  </option>
                              );
                          })}
                      </select>
                      </div>
                    <div
                      className="header-dropdown-menu"
                      onClick={toggleDropdown}
                    >
                      <img src={MenuIcon} alt='menu' height='30px' />
                    </div>

                    {isOpen && ( 
                      <div className="auth-nav-links">
                        
                        <a  href="#third-section" onClick={(e) => handleClick(e, "third-section")}>
                          {t('features')}
                        </a>
                        <a href="#fourth-section" onClick={(e) => handleClick(e, "fourth-section")}>
                          {t('about_link')}
                        </a>
                        <Link to='LoginPage'>{t('login')}</Link>
                        <Link to='SignupPage'>{t('signup')}</Link>
                        <select value={lang} onChange={handleChange}>
                          {languages.map((item) => {
                              return (
                                  <option
                                      key={item.value}
                                      value={item.value}
                                  >
                                      {item.text}
                                  </option>
                              );
                          })}
                      </select>
                      </div>
                    )}
                  </div>

        </div>
    </>
  )
}

export default UnauthHeader