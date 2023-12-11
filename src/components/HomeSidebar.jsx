import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import NeatlistLogo from '../images/neatlist-transparent.png'
import DashboardIcon from '../images/dashboard.png'
import LogoutIcon from '../images/icons8-logout-50.png'
import DarkmodeIcon from '../images/icons8-dark-mode-48.png'
import LightmodeIcon from '../images/icons8-light-mode-78.png'

import './HomeSidebar.css'

const HomeSidebar = ({changeTheme, isDarkMode}) => {
    const auth = useAuth()
    const navigate = useNavigate()

    const handleChangeTheme =  () => {
        changeTheme()
    }

    const handleSignout = async () => {
        await auth.SignOut()
        navigate('/')
      }

  return (
    <>
        <div className={isDarkMode ? 'sidebar-container dark-mode' : 'sidebar-container'}>
            <div className='sidebar-logo-wrapper'>
                <img src={NeatlistLogo} alt='logo'width='250px'/>
            </div>
            <div className={isDarkMode ? 'col-dark': 'col'}>
                <p>Overview</p>
                <div className={isDarkMode ? 'dashboard-button-dark': 'dashboard-button'}>
                    <img src={DashboardIcon} alt='dashboard' height='25px'/>
                    <p>Dashboard</p>
                </div>
                <div className={isDarkMode?'sidebar-links-dark':'sidebar-links'}>
                    <p> <Link to='/' style={{textDecoration: 'none',color: isDarkMode ? 'white' : 'black'}}>Home</Link></p>
                    <p> <Link to='/' style={{textDecoration: 'none',color: isDarkMode ? 'white' : 'black'}}>Features</Link></p>
                    <p> <Link to='/' style={{textDecoration: 'none',color: isDarkMode ? 'white' : 'black'}}>About</Link></p>
                </div>
            </div>
            <div className='spacer'></div>
            <div className='user-actions'>
                <div className='settings' onClick={() => handleChangeTheme()}>
                    {isDarkMode?
                    <div className='theme'>
                        <img src={DarkmodeIcon} alt='settings' height='23px' width='23px' />
                        <p>Dark Mode</p>
                    </div>:
                    <div className='theme'>
                        <img src={LightmodeIcon} alt='settings' height='30px' width='30px' />
                        <p>Light Mode</p>
                    </div>
                    }
                </div>
                <div className='logout' onClick={()=>handleSignout()}>
                    <img src={LogoutIcon} alt='logout' height='20px' width='20px'/>
                    <p style={{color:'#CF4B00'}}>Logout</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default HomeSidebar