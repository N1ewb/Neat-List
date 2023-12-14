import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'

import UnauthHeader from '../components/UnauthHeader'
import Header from '../components/Header'
import LoginBG from '../images/loginbg.png'
import TaskImg from '../images/task-organize.jpg'
import UserFriendlyImg from '../images/user-friendly.png'
import NotifImg from '../images/voicecommand.png'
import SearchImg from '../images/two-tiny-characters-examining-big-cloud_74855-14190.png'
import Organized from '../images/pexels-photo-4360353.jpeg'
import NeatlistLogo from '../images/neatlist-transparent.png'


import './LandingPage.css'
import '../App.css'
import Footer from '../components/Footer'


const LandingPage = ({languages, t}) => {
    const auth = useAuth()
  return (
    <>
        <AuthProvider>
        {auth.currentUser ?<Header languages={languages} t={t}/> : <UnauthHeader languages={languages} t={t}/>}
        <div className='landingpage-container' style={{backgroundColor:"#545763"}}>
            <section id='first-section' className='first-section' style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='landing-content landing-left'>
                    <div className='landing-logo-wrapper'> 
                        <img src={NeatlistLogo} alt='neatlist' width='400px' />
                    </div>
                    <div className='brief-intro'>
                        <p>{t('brief_intro')}</p>
                    </div>
                    {auth.currentUser ?
                        <Link to={'/dashboard'}>
                            <button className='get-started'>{t('get_started')}</button>
                        </Link>
                    : 
                    <Link to={'/LoginPage'}>
                        <button className='get-started'>{t('get_started')}</button>
                    </Link>
                    }
                    
                </div>
                <div className='landing-content landing-right'>

                </div>
            </section>
            <section id="second-section" className='second-section'>
                <div className='motto'>
                    <p>{t('motto')}</p>
                </div>
            </section>
            <section id="third-section" className='third-section'>
                <div className='neatlist-features-container'>
                    <div className='landing-title-container'>
                        <div className='landing-title'><h1>{t('features_title')}</h1></div>
                    </div>

                    <div className='feature-card-container'>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img  src={TaskImg} alt="task"/>
                            </div>
                            <div className='feature-title'>
                                <h3>{t('task_organization')}</h3>
                            </div>
                            <div className='feature-body'>
                                <p>{t('f_feature_body')}</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={UserFriendlyImg} alt="user friendly"/>
                            </div>
                            <div className='feature-title'>
                                <h3>{t('user_interface')}</h3>
                            </div>
                            <div className='feature-body'>
                                <p>{t('s_feature_body')}</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={NotifImg} alt="reminder"/>
                            </div>
                            <div className='feature-title'>
                                <h3>{t('vm')}</h3>
                            </div>
                            <div className='feature-body'>
                                <p>{t('voice-command-feature')}</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={SearchImg} alt="searching" />
                            </div>
                            <div className='feature-title'>
                                <h3>{t('smart_filters')}</h3>
                            </div>
                            <div className='feature-body'>
                            {t('fo_feature_body')}
                            </div>
                        </div>

                    </div>

                </div>
            </section>
            <section id="fourth-section" className='fourth-section'>
                <div className='about-neat-list-container'>
                    <div className='landing-title-container'>
                        <div className='landing-title'>
                            <h1>{t('feature_title2')}</h1>
                        </div>
                    </div>
                    <div className='about-neat-list'>
                        <div className=''>
                            <img src={Organized} alt="organize" height='auto' width='400px'/>
                        </div>
                        <div className='about-description'>
                            <div className='about-logo-wrapper'> 
                                <p>Neat<span>List</span></p>
                            </div>
                            <p>{t('about')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='footer-section'>
                <Footer t={t}/>
            </section>
        </div>
        </AuthProvider>
    </>
  )
}

export default LandingPage