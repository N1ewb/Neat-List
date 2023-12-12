import React,{useEffect, useState,useCallback} from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DBProvider,useDB } from '../context/dbContext'

import './Home.css'

import TaskList from '../components/TaskList'
import HomeSidebar from '../components/HomeSidebar'
import NotificationBlueIcon from '../images/icons8-notification-96(-xxxhdpi).png'
import NotificationWhiteIcon from '../images/icons8-notification-white-96.png'
import NotificationBlackIcon from '../images/icons8-notification-96.png'
import UserIcon from '../images/icons8-user-40.png'
import NeatlistLogo from '../images/Neatlist small.png'

const Home = () => {
  const auth = useAuth()
  const db = useDB()
  const navigate = useNavigate()
  const [search, setSearch] = useState(''); 
  const [isDarkmode, setDarkMode] = useState(false)
  const [taskList, setTaskList] = useState([])
  const [currentTasks, setCurrentTasks] = useState(0)
  const [schoolsTasks, setSchoolsTasks] = useState([])
  const [completedSchoolTasks, setCompletedSchoolTask] = useState([])
  const [personalTasks, setPersonalTasks] = useState([])
  const [completedPersonalTasks, setCompletedPersonalTasks] = useState([])
  const [workTasks, setWorkTasks] = useState([])
  const [completedWorkTasks, setCompletedWorkTask] = useState([])
  const [pending, setPending] = useState([])
  const [complete, setComplete] = useState([])

  const changeTheme = () => {
    setDarkMode(!isDarkmode)
  }

  const handleGetTasks = useCallback (async (uid) => {
    const tasks = await db.getUserTask(uid)
    return tasks
  },[db]);

  const filterSchoolTasks = useCallback(() => {
    if (schoolsTasks.length === 0) {
      const filtered = taskList.filter((task) => task.category === 'study');
      setSchoolsTasks(filtered)
    }
  },[taskList,schoolsTasks]);

  const filterCompletedSchoolTasks = useCallback(() => {
    if (completedSchoolTasks.length === 0) {
      const filtered = schoolsTasks.filter((task) => task.category === 'study' && task.status === true );
      setCompletedSchoolTask(filtered)
    }
  }, [completedSchoolTasks,schoolsTasks]);

  const filterPersonalTasks = useCallback(() => {
    if (personalTasks.length === 0) {
      const filtered = taskList.filter((task) => task.category === 'personal');
      setPersonalTasks(filtered)
    }
  },[taskList,personalTasks]);

  const filterCompletedPersonalTasks = useCallback(() => {
    if (completedPersonalTasks.length === 0) {
      const filtered = personalTasks.filter((task) => task.category === 'personal' && task.status === true );
      setCompletedPersonalTasks(filtered)
    }
  }, [completedPersonalTasks,personalTasks]);

  const filterWorkTasks = useCallback(() => {
    if (workTasks.length === 0) {
      const filtered = taskList.filter((task) => task.category === 'work');
      setWorkTasks(filtered)
    }
  },[taskList,workTasks]);

  const filterCompletedWorkTasks = useCallback(() => {
    if (completedWorkTasks.length === 0) {
      const filtered = workTasks.filter((task) => task.category === 'work' && task.status === 'completed' );
      setCompletedWorkTask(filtered)
    }
  }, [completedWorkTasks, workTasks]);

  const filterPending = useCallback(()=>{
    if(pending.length === 0){
      const filtered = taskList.filter((task) => task.status === 'pending');
      setPending(filtered)
    }
  },[taskList,pending])

  const filterComplete = useCallback(()=>{
    if(complete.length === 0){
      const filtered = taskList.filter((task) => task.status === 'completed');
      setComplete(filtered)
    }
  },[taskList,complete])

  useEffect(() => {
    if (taskList.length !== 0) {
      filterComplete();
      filterPending();
    }
  }, [taskList]);

  useEffect(()=>{
    if(taskList.length !== 0){
      filterSchoolTasks()
      filterCompletedSchoolTasks()

      filterPersonalTasks()
      filterCompletedPersonalTasks()

      filterWorkTasks()
      filterCompletedWorkTasks()
    }
  },[taskList])
  
  useEffect(()=>{
    const fetchTasks = async () => {
      try{
        const tasks = await handleGetTasks()
        setTaskList(tasks)
        const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
          setTaskList(updatedTasks);
          setCurrentTasks(updatedTasks.length);

          if(schoolsTasks !== 0){
            setSchoolsTasks([])
            setCompletedSchoolTask([])
          }
          if(personalTasks !== 0){
            setPersonalTasks([])
            setCompletedPersonalTasks([])
          }
          if(workTasks !== 0){
            setWorkTasks([])
            setCompletedWorkTask([])
          }

          if(pending !== 0){
            setPending([])
          }
          if(complete !== 0){
            setComplete([])
          }

        });
        return () => unsubscribe();
      }catch(error){
        db.notifyError(error)
      }
    }
    fetchTasks()
  },[db,handleGetTasks])
 
  useEffect(()=>{
    if(!auth.currentUser){
        navigate('/')
    }
},[auth.currentUser, navigate])

  return (
    <>
      <AuthProvider>
        <DBProvider>
          <div className={isDarkmode?'dashboard-container-dark': 'dashboard-container'}>
            <HomeSidebar changeTheme={changeTheme} isDarkMode={isDarkmode}/>
            <div className='dashboard'>
              {auth.currentUser ? '' : 'Not logged in'}
              <div className={'dashboard-heading'}>
                <div className={isDarkmode? 'dashboard-navbar-dark': 'dashboard-navbar'}>
                  <div className='logo-wrapper'>
                    < img src={NeatlistLogo} alt='neatlist' width='100%' />
                  </div>
                  <div className='dashboard-spacer'></div>
                  <input name='search' onChange={(e)=>setSearch(e.target.value)} placeholder='Search'/>
                  <div className='user-info'>
                    <img className={isDarkmode?'notfication-img-dark':'notfication-img'} src={isDarkmode?NotificationBlueIcon:NotificationWhiteIcon} alt='notification' height='40px' />
                    <div className='user-profile'>
                      <img src={auth.currentUser && auth.currentUser.photoURL?auth.currentUser.photoURL:UserIcon} alt='user-icon' height='50px' />
                      <h6>{auth.currentUser? auth.currentUser.displayName: 'Unknown'}</h6>
                    </div>
                  </div>
                </div>
                <div className='dashboard-intro'>
                  <h1>Master Your Tasks with Neat List</h1>
                  <p>Your tasks ({currentTasks})</p>
                </div>
                <div className='intro-spacer'></div>
                <div className='dashboard-graph-container'>
                  <div className={isDarkmode ? 'dashboard-graph-dark' : 'dashboard-graph'}>
                    <div className='graph-bars'>
                      <div className={isDarkmode ? 'bar-dark school-bar-dark':'bar school-bar'} style={{ width: `${(taskList.length !== 0 && schoolsTasks ? completedSchoolTasks.length / schoolsTasks.length : 0) * 100}%` }} ></div>
                      <h5>School Tasks: {taskList.length !== 0 && schoolsTasks ? schoolsTasks.length : 0}</h5>
                      <div className={isDarkmode ? 'bar-dark school-bar-dark':'bar personal-bar'} style={{ width: `${(taskList.length !== 0 && personalTasks ? completedPersonalTasks.length / personalTasks.length : 0) * 100}%` }} ></div>
                      <h5>Personal Tasks: {taskList.length !== 0 && personalTasks ? personalTasks.length : 0}</h5>
                      <div className={isDarkmode ? 'bar-dark school-bar-dark':'bar work-bar'} style={{ width: `${(taskList.length !== 0 && workTasks ? completedWorkTasks.length / workTasks.length : 0) * 100}%` }} ></div>
                      <h5>Work Tasks: {taskList.length !== 0 && workTasks ? workTasks.length : 0}</h5>
                    </div>
                        <div className='tasks-number' >
                          <div className='bar completion-bar' style={{ width: `${(taskList.length !== 0 && pending ?complete.length / taskList.length : 0) * 100}%` }}></div>
                        <h5 style={{width:'100%'}}>Completion Rate: <span className="progress-text">{taskList.length !== 0?(complete.length / taskList.length) * 100: 0}%</span></h5>
                        <div className='pending'>
                          <h3>{pending.length} Tasks</h3>
                          <p>Pending</p>
                        </div>
                        <div className='completed'>
                          <h3>{complete.length} Tasks</h3>  
                          <p>Completed</p>
                        </div>
                      </div>
                      </div>
                  </div>
                </div>
                <section className='tasklist'>
                  <TaskList search={search} isDarkmode={isDarkmode}/> 
                </section>
            </div>
          </div>
          </DBProvider>
        </AuthProvider>
    </>
  )
}

export default Home