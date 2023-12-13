import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'

import TriaIcon from '../images/tria (2).png'
import FacebookIcon from '../images/icons8-facebook-48.png'
import TwitterIcon from '../images/icons8-twitterx-48.png'
import './Footer.css'





const Footer = ({t}) => {
  

  return (
    <>
        <div className='footer-container'>

            <div className='footer-navigation'>
              <div className='footer-titles'>
                <h2>{t('navigation')}</h2>
              </div>
              <div className='footer-nav-links'>
                <a href='#first-section'>{t('landing_page')}</a>
                <p > <Link to='Dashboard'>{t('dashboard')}</Link> </p>
                <a href='#third-section' >{t('features')}</a>
                <a href='#fourth-section' >{t('about_link')}</a>
              </div>
            </div>

            <div className='contact-us'>
              <div className='footer-titles'>
                <h2>{t('contact_us')}</h2>
              </div>
              <div className='social-medias'>
                <a href='https://www.facebook.com/profile.php?id=61551731377409' ><img src={TriaIcon} alt='Tria Web Design' width='18px' /> <span>Tria Web Design</span></a>
                <a href='https://www.facebook.com/nathaniel.lucero.9212' > <img src={FacebookIcon} alt='' width='20px' /> <span>Facebook</span></a>
                <a href='https://twitter.com/NathanielLuce16' > <img src={TwitterIcon} alt='' width='20px' /> <span>Twitter</span></a>
              </div>
            </div>

            <div className='Account'>
              <div className='footer-titles'>
                <h2>{t('account')}</h2>
              </div>
              <div className='account-links'>
                <p> <Link to='SignupPage'>{t('create-account')}</Link> </p>
                <p> <Link to='LoginPage' >{t('login')}</Link></p>
              </div>
            </div>
            <div className='copyright-statement'>
              <p>{t("copyright")}</p>
            </div>
            
        </div>
    </>
  )
}

export default Footer