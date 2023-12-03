import React from 'react'
import {Link} from 'react-router-dom'

import LoginBG from '../images/loginbg.png'
import GoogleIcon from '../images/icons8-google-48.png'
import black from '../images/black.png'
import UnauthHeader from '../components/UnauthHeader'

import './SignupPage.css' 

const SignupPage = () => {
  return (
    <>
    <UnauthHeader />
        <div className='signup-container' style={{backgroundColor:"#545763"}}>
            <div className='sign-up' style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='content left' style={{backgroundImage:`url(${black})`}}>
                    <div className='spacer'></div>
                    <div className='login-form-container'>
                        <div className='loing-form-container-heading'>
                            <div className='loing-form-container-heading-wrapper'>
                                <p>Start for Free</p>
                                <h1>Create New Account</h1>
                                <p>Already have an Account? <Link to={'/LoginPage'} style={{textDecoration: 'none'}}><span>Login</span></Link></p>
                            </div>
                        </div>
                        <div className="signin-form">
                            <div className='fullname'>
                                <i className="fa fa-address-card-o" aria-hidden="true"></i>
                                <input name="First-Name" type='text' placeholder='First Name'/>
                                <i className="fa fa-address-card-o" aria-hidden="true"></i>
                                <input name='Last-Name' type='text' placeholder='Last Name'/>
                            </div>
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            <input type='email' name="email" placeholder='Email'/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input type='password' name="password" placeholder='Password'/>

                            <div className='sign-in-buttons'>
                                    <button className='singin-button'>Sign Up</button>
                                <div className='with-google'>
                                <p><img src={GoogleIcon} alt="Google Icon"  height="20px" /> Sign up with Google</p>
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

export default SignupPage