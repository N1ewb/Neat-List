import React from 'react'
import { Link } from 'react-router-dom'
import './UnauthHeader.css'
const UnauthHeader = () => {
  return (
    <>
        <div className='unauth-header-container'>
            <div className='unauth-nav-bar'>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <div className='logo-wrapper'> 
                        <p>Neat <span>List</span></p>
                    </div>
                </Link>
                <div className="spacer"></div>
                <div className='nav-links'>
                    
                </div>
            </div>
        </div>
    </>
  )
}

export default UnauthHeader