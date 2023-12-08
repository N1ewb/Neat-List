import React,{useEffect} from 'react'
import Header from '../components/Header'
import UnauthHeader from '../components/UnauthHeader'
import { AuthProvider,useAuth } from '../context/AuthContext'

import './Home.css'
import TaskForm from '../components/TaskForm'
import { useNavigate } from 'react-router-dom'
import { DBProvider } from '../context/dbContext'
import TaskList from '../components/TaskList'

const Home = ({value}) => {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if(!auth.currentUser){
        navigate('/')
    }
},[auth.currentUser, navigate])

  return (
    <>
        <AuthProvider>
          <div className='home-container'>
            {auth.currentUser ?<Header /> : <UnauthHeader/>}
            <div className='home'>
              {auth.currentUser ? '' : 'Not logged in'}
              <DBProvider>
                <section className='form-section'>
                  <TaskForm />
                </section>
                <section>
                  <TaskList />
                </section>
              </DBProvider>
            </div>
          </div>
        </AuthProvider>
    </>
  )
}

export default Home