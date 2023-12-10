import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import NeatlistLogo from '../images/neatlist-transparent.png'
import NeatlistLogoDark from '../images/NeatList Logo.png'
import DashboardIcon from '../images/dashboard.png'
import LogoutIcon from '../images/icons8-logout-50.png'
import SettingsIcon from '../images/icons8-settings-48.png'
import DarkmodeIcon from '../images/icons8-dark-mode-48.png'

import './HomeSidebar.css'

const HomeSidebar = ({changeTheme, theme}) => {
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
        <div className={theme ? 'sidebar-container dark-mode' : 'sidebar-container'}>
            <div className='sidebar-logo-wrapper'>
                <img src={theme ? NeatlistLogoDark: NeatlistLogo} alt='logo'width='250px'/>
            </div>
            <div className={theme ? 'col-dark': 'col'}>
                <p>Overview</p>
                <div className={theme? 'dashboard-button-dark': 'dashboard-button'}>
                    <img src={DashboardIcon} alt='dashboard' height='25px'/>
                    <p>Dashboard</p>
                </div>
                <div className='sidebar-links'>
                    <Link to='/' style={{textDecoration:'none', color:'black'}}>Home</Link>
                    <Link to='/' style={{textDecoration:'none', color:'black'}}>Features</Link>
                    <Link to='/' style={{textDecoration:'none', color:'black'}}>About</Link>
                </div>
            </div>
            <div className='spacer'></div>
            <div className='user-actions'>
                <div className='settings' onClick={() => handleChangeTheme()}>
                    <img src={DarkmodeIcon} alt='settings' height='23px' width='23px' />
                    <p>Dark Mode</p>
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