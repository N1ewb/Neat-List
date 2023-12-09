import React,{useEffect, useState,useCallback} from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DBProvider,useDB } from '../context/dbContext'

import './Home.css'

import TaskList from '../components/TaskList'
import HomeSidebar from '../components/HomeSidebar'
import NotificationIcon from '../images/icons8-notification-48.png'
import UserIcon from '../images/icons8-user-40.png'

const Home = () => {
  const auth = useAuth()
  const db = useDB()
  const navigate = useNavigate()

  const [tasksList, setTaskLists] = useState([])
  const [temp, setTemp] = useState()
  const [search, setSearch] = useState(); 
  const sortedTasks = useCallback(() => {
    return [...tasksList];
  },[tasksList])

  const searchTask = useCallback (async (search) => {
      if (search && temp) {
          const filtered = temp.filter((task) => task.name.toLowerCase().includes(search.toLowerCase()));
          setTaskLists(filtered);
      } else {
          setTaskLists(temp);
      }
  },[temp]);

  const handleGetTasks = useCallback (async () => {
      const tasks = await db.getTask()
      console.log(tasks)
      return tasks
      
  },[db]);
  
    useEffect(() => {
      const fetchData = async () => {
          try {
              const tasks = await handleGetTasks();
              setTaskLists(tasks);
              setTemp(tasks)
              sortedTasks()
              const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                  setTaskLists(updatedTasks);
              });
              return () => unsubscribe();
          } catch (error) {
             
          }
      };
      fetchData();
      
  }, [db, handleGetTasks, sortedTasks]);

  useEffect(() => {
      searchTask(search);
  }, [search, searchTask]);


  useEffect(()=>{
    if(!auth.currentUser){
        navigate('/')
    }
},[auth.currentUser, navigate])

  return (
    <>
        <DBProvider>
          <div className='dashboard-container'>
            <HomeSidebar />
            <div className='dashboard'>
              {auth.currentUser ? '' : 'Not logged in'}
              <div className='dashboard-heading'>
                <div className='dashboard-navbar'>
                  <input name='search' onChange={(e)=>setSearch(e.target.value)} placeholder='Search'/>
                  <div className='dashboard-spacer'></div>
                  <img className='notfication-img' src={NotificationIcon} alt='notification' height='26' />
                  <div className='user-profile'>
                    <img src={auth.currentUser?auth.currentUser.photoURL:UserIcon} alt='user-icon' height='50px' />
                    <h6>{auth.currentUser? auth.currentUser.displayName: null}</h6>
                  </div>
                </div>
                <div className='dashboard-intro'>
                  <h1>Master Your Tasks with Neat List</h1>
                  <p>Your Tasks ({tasksList ? tasksList.length : 0})</p>
                </div>
                <div className='intro-spacer'></div>
                <div className='dashboard-graph'>
                 
                </div>
              </div>
                <section className='tasklist'>
                  <TaskList temp={temp} tasksList={tasksList} sortedTasks={sortedTasks}/> 
                </section>
            </div>
          </div>
          </DBProvider>
    </>
  )
}

export default Home