import React from 'react'
import { Link } from 'react-router-dom'

import LoginBG from '../images/loginbg.png'
import GoogleIcon from '../images/icons8-google-48.png'
import black from '../images/black.png'

import './LoginPage.css'

import UnauthHeader from '../components/UnauthHeader'

const LoginPage = () => {
  return (
    <>
    <UnauthHeader />
        <div className='login-container' style={{backgroundColor:"#545763"}}>
            <div className='login'style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='content left' style={{backgroundImage:`url(${black})`}}>
                    <div className='spacer'></div>
                    <div className='login-form-container'>
                        <div className='loing-form-container-heading'>
                            <div className='loing-form-container-heading-wrapper'>
                                <p>Start your Journey</p>
                                <h1>Login to your Account</h1>
                                <p>Dont have an Account? <Link to={'/SignupPage'} style={{textDecoration: 'none'}}><span>Sign Up</span></Link></p>
                            </div>
                        </div>
                        <div className="login-form">
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            <input type='email' name="email" placeholder='Email'/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input type='password' name="password" placeholder='Password'/>
                            <div className='login-buttons'>
                                    <button className='login-button'>Login</button>
                                <div className='with-google'>
                                <p><img src={GoogleIcon} alt="Google Icon"  height="20px" /> Sign in with Google</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='content right'>

                </div>
            </div>
        </div>
    </>
  )
}

export default LoginPage