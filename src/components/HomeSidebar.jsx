import React from 'react'
import { Link } from 'react-router-dom'

import NeatlistLogo from '../images/neatlist-transparent.png'
import DashboardIcon from '../images/dashboard.png'
import LogoutIcon from '../images/icons8-logout-50.png'
import SettingsIcon from '../images/icons8-settings-48.png'

import './HomeSidebar.css'

const HomeSidebar = () => {
  return (
    <>
        <div className='sidebar-container'>
            <div className='sidebar-logo-wrapper'>
                <img src={NeatlistLogo} alt='logo'width='250px'/>
            </div>
            <div className='col'>
                <p>Overview</p>
                <div className='dashboard-button'>
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
                <div className='settings'>
                    <img src={SettingsIcon} alt='settings' height='23px' width='23px' />
                    <p>Settings</p>
                </div>
                <div className='logout'>
                    <img src={LogoutIcon} alt='logout' height='20px' width='20px'/>
                    <p style={{color:'#CF4B00'}}>Logout</p>
                </div>
            </div>
        </div>
    </>
  )
}

export default HomeSidebar