import React from 'react'
import { Link } from 'react-router-dom'

import UnauthHeader from '../components/UnauthHeader'
import LoginBG from '../images/loginbg.png'
import TaskImg from '../images/task-organize.jpg'
import UserFriendlyImg from '../images/user-friendly.png'
import NotifImg from '../images/reminder-sky-background_118813-968.jpg'
import SearchImg from '../images/two-tiny-characters-examining-big-cloud_74855-14190.png'
import Organized from '../images/pexels-photo-4360353.jpeg'

import './LandingPage.css'


const LandingPage = () => {
  return (
    <>
        <UnauthHeader/>
        <div className='landingpage-container' style={{backgroundColor:"#545763"}}>
            <section className='first-section' style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='content landing-left'>
                    <div className='landing-logo-wrapper'> 
                        <p>Neat <span>List</span></p>
                    </div>
                    <div className='brief-intro'>
                        <p>Your go-to task manager for streamlined productivity, offering intuitive features to organize tasks and boost efficiency effortlessly, empowering you to stay focused and achieve more.</p>
                    </div>
                    <Link to={'/LoginPage'}>
                        <button className='get-started'>Get Started</button>
                    </Link>
                </div>
                <div className='content landing-right'>

                </div>
            </section>
            <section className='second-section'>
                <div className='motto'>
                    <p>Your streamlined task manager for effortless productivity and organized living.</p>
                </div>
            </section>
            <section className='third-section'>
                <div className='neatlist-features-container'>
                    <div className='landing-title-container'>
                        <div className='landing-title'><h1>Neat List Features</h1></div>
                    </div>

                    <div className='feature-card-container'>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img  src={TaskImg} alt="task"/>
                            </div>
                            <div className='feature-title'>
                                <h3>Task Organization</h3>
                            </div>
                            <div className='feature-body'>
                                <p> Neat List simplifies task management by letting users sort tasks by project, priority, or deadline using drag-and-drop features and customizable labels. This allows for an organized view of tasks based on individual preferences.</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={UserFriendlyImg} />
                            </div>
                            <div className='feature-title'>
                                <h3>User-Friendly Interface</h3>
                            </div>
                            <div className='feature-body'>
                                <p>With its intuitive design and user interface, Neat List offers a hassle-free and enjoyable task management experience. Its user-centric approach ensures ease of use and quick adaptation, empowering users to navigate the platform effortlessly.</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={NotifImg} />
                            </div>
                            <div className='feature-title'>
                                <h3>Reminders and Notifications</h3>
                            </div>
                            <div className='feature-body'>
                                <p>Keep productivity on track with personalized reminders and notifications tailored to impending deadlines or crucial tasks. Neat List ensures users stay informed and punctual, whether through email alerts or in-app notifications, minimizing the chances of missing important milestones.</p>
                            </div>
                        </div>

                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={SearchImg} />
                            </div>
                            <div className='feature-title'>
                                <h3>Smart Filters and Search</h3>
                            </div>
                            <div className='feature-body'>
                            Efficiently locate specific tasks or lists through smart filtering options and a robust search function. Neat List enables users to find and focus on particular tasks swiftly, minimizing time spent searching and maximizing productivity.
                            </div>
                        </div>

                    </div>

                </div>
            </section>
            <section className='fourth-section'>
                <div className='about-neat-list-container'>
                    <div className='landing-title-container'>
                        <div className='landing-title'>
                            <h1>Neat List</h1>
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
                            <p>Neat List is a robust task management platform designed to streamline organization and enhance productivity. It offers intuitive features for effortless task categorization, collaboration, and deadline management. With customizable views and seamless integrations, Neat List empowers users to stay organized and focused, simplifying daily workflows for individuals and teams alike.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </>
  )
}

export default LandingPage