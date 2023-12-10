import React,{useEffect, useState,useCallback} from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DBProvider,useDB } from '../context/dbContext'

import './Home.css'

import TaskList from '../components/TaskList'
import HomeSidebar from '../components/HomeSidebar'
import NotificationIcon from '../images/icons8-notification-48.png'
import UserIcon from '../images/icons8-user-40.png'


const Home = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState(''); 
  const [theme, setTheme] = useState(false)

  const changeTheme = () => {
    setTheme(!theme)
  }

  useEffect(()=>{
    if(!auth.currentUser){
        navigate('/')
    }
},[auth.currentUser, navigate])

  return (
    <>
      <AuthProvider>
        <DBProvider>
          <div className='dashboard-container'>
            <HomeSidebar changeTheme={changeTheme} theme={theme}/>
            <div className='dashboard'>
              {auth.currentUser ? '' : 'Not logged in'}
              <div className='dashboard-heading'>
                <div className='dashboard-navbar'>
                  <input name='search' onChange={(e)=>setSearch(e.target.value)} placeholder='Search'/>
                  <div className='dashboard-spacer'></div>
                  <img className='notfication-img' src={NotificationIcon} alt='notification' height='26' />
                  <div className='user-profile'>
                    <img src={auth.currentUser && auth.currentUser.photoURL?auth.currentUser.photoURL:UserIcon} alt='user-icon' height='50px' />
                    <h6>{auth.currentUser? auth.currentUser.displayName: null}</h6>
                  </div>
                </div>
                <div className='dashboard-intro'>
                  <h1>Master Your Tasks with Neat List</h1>
                  <p></p>
                </div>
                <div className='intro-spacer'></div>
                <div className='dashboard-graph'>
                 
                </div>
              </div>
                <section className='tasklist'>
                  <TaskList search={search}/> 
                </section>
            </div>
          </div>
          </DBProvider>
        </AuthProvider>
    </>
  )
}

export default Home