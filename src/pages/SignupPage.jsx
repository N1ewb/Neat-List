import React,{useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast';

import LoginBG from '../images/loginbg.png'
import GoogleIcon from '../images/icons8-google-48.png'
import black from '../images/black.png'
import UnauthHeader from '../components/UnauthHeader'
import Header from '../components/Header'

import './SignupPage.css' 

const SignupPage = ({t, languages}) => {
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const auth = useAuth()
    const navigate = useNavigate()
    const passwordError = () => toast('Password dont match')
    const passwordCharsError = () => toast('Password should be 6 characters or longer')

    const handleSignUp = (e) => {
        if (passwordRef.current.value.length < 6) {
          passwordCharsError();
        } else {
          if (passwordRef.current.value === passwordConfirmRef.current.value) {
            auth.SignUp(emailRef.current.value, passwordRef.current.value,firstNameRef.current.value,lastNameRef.current.value)
              
          } else {
            passwordError();
          }
        }
      };
      
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
    {auth.currentUser ?<Header t={t} languages={languages} /> : <UnauthHeader t={t} languages={languages}/>}
        <div className='signup-container' style={{backgroundColor:"#545763"}}>
            <div className='sign-up' style={{backgroundImage:`url(${LoginBG})`}}>
                <div className='content-signup left' style={{backgroundImage:`url(${black})`}}>
                    <div className='spacer'></div>
                    <div className='signin-form-container'>
                        <div className='signin-form-container-heading'>
                            <div className='signin-form-container-heading-wrapper'>
                                <p>{t('start_for_free')}</p>
                                <h1>{t('create_new_account')}</h1>
                                <p>{t('already_have_account')} <Link to={'/LoginPage'} style={{textDecoration: 'none'}}><span>{t('login')}</span></Link></p>
                            </div>
                        </div>
                        <div className="signin-form">
                            <div className='fullname'>
                                <i className="fa fa-address-card-o" aria-hidden="true"></i>
                                <input ref={firstNameRef}  name="First-Name" type='text' placeholder={t('first_name')}/>
                                <i className="fa fa-address-card-o" aria-hidden="true"></i>
                                <input ref={lastNameRef} name='Last-Name' type='text' placeholder={t('last_name')}/>
                            </div>
                            <i className="fa fa-envelope" aria-hidden="true"></i>
                            <input ref={emailRef} type='email' name="email" placeholder={t('email')}/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input ref={passwordRef} type='password' name="password" placeholder={t('password')}/>
                            <i className="fa fa-lock" aria-hidden="true"></i>
                            <input  ref={passwordConfirmRef} type='password' name="confirm-password" placeholder={t('confirm_password')}/>
                            <div className='sign-in-buttons'>
                                    <button type='submit' className='singin-button' onClick={() => handleSignUp()} >{t('signup')}</button>
                                <div className='with-google' onClick={()=>handleSignInWithGoogle()}>
                                <p><img src={GoogleIcon} alt="Google Icon"  height="20px" /> <span>{t('sign-in-with-google')}</span></p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='content right'>
                    <Toaster />
                </div>
            </div>
        </div>
    </AuthProvider>
    </>
  )
}

export default SignupPage