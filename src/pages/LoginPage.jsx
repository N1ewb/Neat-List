import React,{useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'

import LoginBG from '../images/loginbg.png'
import GoogleIcon from '../images/icons8-google-48.png'
import black from '../images/black.png'
import UnauthHeader from '../components/UnauthHeader'
import Header from '../components/Header'

import './LoginPage.css'

const LoginPage = () => {
    const auth = useAuth()
    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    const handleSignIn = (e) => {
        auth.SignIn(emailRef.current.value, passwordRef.current.value)
    }

    const handleSignInWithGoogle = (e) => {
        auth.SignInWithGoogle()
    }
    
    useEffect(()=>{
        if(auth.currentUser){
            navigate('/dashboard')
        }
    },[auth.currentUser, navigate])

  return (
    <>
    <AuthProvider>
        {auth.currentUser ?<Header /> : <UnauthHeader/>}
        <div className='login-container' style={{backgroundColor:"#545763"}}>
            <div className='login'style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='content-login left' style={{backgroundImage:`url(${black})`}}>
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
                            <input ref={emailRef} type='email' name="email" placeholder='Email'/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input ref={passwordRef} type='password' name="password" placeholder='Password'/>
                            <div className='login-buttons'>
                                    
                                    <button type='submit' onClick={()=> handleSignIn()} className='login-button'>Login</button>
                                    
                                <div className='login-with-google' onClick={()=> handleSignInWithGoogle()}>
                                <p><img src={GoogleIcon} alt="Google Icon"  height="20px" /> <span>Sign in with Google</span></p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='content right'>
                </div>
            </div>
        </div>
    </AuthProvider>
    </>
  )
}

export default LoginPage