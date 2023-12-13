import React from 'react'
import { Link,useNavigate } from 'react-router-dom'

import TriaIcon from '../images/tria (2).png'
import FacebookIcon from '../images/icons8-facebook-48.png'
import TwitterIcon from '../images/icons8-twitterx-48.png'


import './Footer.css'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <>
        <div className='footer-container'>

            <div className='footer-navigation'>
              <div className='footer-titles'>
                <h2>Navigation</h2>
              </div>
              <div className='footer-nav-links'>
                <a href='#first-section'>  Landing Page</a>
                <a href='' > <Link to='Dashboard'>Dashboard</Link> </a>
                <a href='#third-section' > Features</a>
                <a href='#fourth-section' > About</a>
              </div>
            </div>

            <div className='contact-us'>
              <div className='footer-titles'>
                <h2>Contact Us</h2>
              </div>
              <div className='social-medias'>
                <a href='https://www.facebook.com/profile.php?id=61551731377409' ><img src={TriaIcon} alt='Tria Web Design' width='18px' /> <span>Tria Web Design</span></a>
                <a href='https://www.facebook.com/nathaniel.lucero.9212' > <img src={FacebookIcon} alt='' width='20px' /> <span>Facebook</span></a>
                <a href='https://twitter.com/NathanielLuce16' > <img src={TwitterIcon} alt='' width='20px' /> <span>Twitter</span></a>
              </div>
            </div>

            <div className='Account'>
              <div className='footer-titles'>
                <h2>Account</h2>
              </div>
              <div className='account-links'>
                <p> <Link to='SignupPage'>Create Account</Link> </p>
                <p> <Link to='LoginPage' >Login</Link></p>
              </div>
            </div>
            <div className='copyright-statement'>
              <p>©Copyright NeatList 2023, All Rights Reserved</p>
            </div>
        </div>
    </>
  )
}

export default Footer