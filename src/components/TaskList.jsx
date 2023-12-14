import React, {useState,useEffect,useCallback } from 'react'
import { useDB } from '../context/dbContext';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Button from 'react-bootstrap/Button';
import {OverlayTrigger} from 'react-bootstrap';
import { Tooltip } from 'react-bootstrap';

import LayoutIcon from '../images/card-layout.png'
import CardLayoutIcon from '../images/card-layout-blue.png'
import LayoutIcon2 from '../images/table-layout.png'
import TableLayoutBlue from '../images/table-layout-blue.png'
import AddIcon from '../images/icons8-add-50.png'
import AddBlueIcon from '../images/icons8-add-blue-filled-50.png'
import PendingIcon from '../images/icons8-pending-50.png'
import CompletedIcon from '../images/icons8-task-completed-48.png'
import OverdueIcon from '../images/icons8-overdue-64.png'
import sortAscIcon from '../images/icons8-ascending-sorting-50.png'
import SortDescIcon from '../images/icons8-descending-sorting-50.png'
import EditIcon from '../images/icons8-edit-text-file-48.png'
import EditIconBlue from '../images/icons8-edit-text-file-blue-48.png'
import DeleteIcon from '../images/icons8-delete-48.png'
import CheckIcon from '../images/icons8-check-48.png'
import MenuIcon from '../images/icons8-menu-48.png'
import ArhiveIcon from '../images/icons8-archive-48.png'
import DeletedIcon from '../images/icons8-deleted-48.png'
import SchoolIcon from '../images/icons8-school-64.png'
import PersonalIcon from '../images/icons8-person-80.png'
import WorkIcon from '../images/icons8-permanent-job-80.png'
import SaveIcon from '../images/icons8-save-50.png'
import InfoIcon from '../images/icons8-info-50.png'
import MicIcon from '../images/icons8-mic-48.png'
import StopIcon from '../images/icons8-stop-circled-50.png'

import TaskForm from './TaskForm'
import TaskTable from './TaskTable';

import './TaskList.css'
import TaskCards from './TaskCards';



const TaskList = ({search, isDarkmode, changeTheme}) => {
    const db = useDB()
    const auth = useAuth()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [sort, setSort] = useState(false)
    const [currentLayout, setCurrentLayout] = useState(true)
    const [taskslist, setTaskLists] = useState([]);
    const [sortedTasks, setSortedTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [temp, setTemp] = useState([]);
    const [archive, setArchive] = useState(false)
    const notify = (message) => toast(message)
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    
    const handleChangeTheme = ()=> {
      changeTheme()
    }

    const handleGetTasks = useCallback (async (uid) => {
        const tasks = await db.getUserTask(uid)
        return tasks
    },[db]);

    const searchTask = useCallback((search) => {
        if (search) {
          const filtered = taskslist.filter((task) =>
            task.name.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredTasks(filtered);
        } else {
          setFilteredTasks(taskslist); 
        }
      }, [taskslist]);

      const filterCategory = useCallback((selectedCategory) => {
        if (selectedCategory !== '') {
          const filtered = temp.filter((task) => task.category === selectedCategory);
          setFilteredTasks(filtered);
        } else {
          setFilteredTasks(taskslist); 
      }
      }, [taskslist,temp]);
    
      const filterArchive = useCallback((selectedArchive)=>{
        if(archive){
          const filtered = temp.filter((task)=> task.status === selectedArchive)
            setFilteredTasks(filtered)
            setArchive(!archive)
          
        } else {
          setFilteredTasks(taskslist)
          setArchive(!archive)
        }
      },[taskslist, temp,archive])

    // const sortDeadlineAsc = () => {
    //     sortedTasks.sort((a, b) => {
    //         return new Date(a.deadline) - new Date(b.deadline);
    //     });
    //     setTaskLists(sortedTasks);
    //     setSort('deadlineAsc');
    // };

    // const sortDeadlineDesc = () => {
    //     sortedTasks.sort((a, b) => {
    //         return new Date(b.deadline) - new Date(a.deadline);
    //     });
    //     setTaskLists(sortedTasks);
    //     setSort('deadlineDesc');
    // };

    // const sortCreatedAsc = async () => {
    //     sortedTasks.sort((a, b) => a.Timestamp- b.Timestamp);
    //     setTaskLists(sortedTasks)
    //     setSort('createdAsc')
    // }

    // const sortCreatedDesc = async () => {
    //     sortedTasks.sort((a, b) => b.Timestamp - a.Timestamp);
    //     setTaskLists(sortedTasks)
    //     setSort('createdDesc')
    // }

    const changeLayout = () => {

          setCurrentLayout(!currentLayout)
        
    }
    const sortPrioAsc = () => {
      if(sort){
        sortedTasks.sort((a, b) => a.priority - b.priority);
        setTaskLists(sortedTasks);
        setSort(!sort)
      }else{
        sortedTasks.sort((a, b) => b.priority - a.priority);
        setTaskLists(sortedTasks);
        setSort(!sort) 
      }
        
    }

    const handleMarkTaskOverdue = async () => {
      if(taskslist.length !== 0){
        taskslist.map(async(task)=> await db.markTaskOverdue(task.id))
      }
    };

    useEffect(() => {
      if (listening && transcript) {
        setTimeout(() => {
          let command = transcript.split(' ');
        
        switch (command[0]) {
          case 'add':
            handleShow()
            resetTranscript();
            break;
          case 'sort':
            sortPrioAsc()
            resetTranscript();
            break;
          case 'change':
            changeLayout()
            resetTranscript();
            break;
          case 'search':
            searchTask(command[1])
            resetTranscript();
            break;
          case 'category':
            filterCategory(command[1])
            resetTranscript();
            break;
          case 'archive':
            filterArchive('completed')
            resetTranscript();
            break;
          case 'theme':
            handleChangeTheme()
            resetTranscript();
            break;
          
          default:
            console.log(command[0])
            resetTranscript();
        }
        }, 2700);
      }
    });
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (auth.currentUser) {
              const tasks = await handleGetTasks();
              setTaskLists(tasks);
              setTemp(tasks);
              setSortedTasks([...tasks]);
              handleMarkTaskOverdue();
            }
            const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
              setSortedTasks([...updatedTasks]);
              setTaskLists(updatedTasks);
              handleMarkTaskOverdue();
            });
            return () => unsubscribe();
          } catch (error) {
            db.notifyError(error);
          }
        };
        fetchData();
      }, [db, handleGetTasks,auth.currentUser]);
      
    useEffect(() => {
        if(search){
            searchTask(search);
        } else {
            setFilteredTasks(taskslist)
        }
     }, [search, searchTask,taskslist]);

     const archiveTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Completed Tasks
      </Tooltip>
     )
    const Mictip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          <h5>Command List</h5>
          <p>add: Open add task form</p>
          <p>sort: Sort priority</p>
          <p>change: Change layout</p>
          <p>search + value: Search task</p>
          <p>category: Filter category</p>
          <p>archive: See completed Tasks</p>
          <p>theme: Change Theme</p>
        </Tooltip>
    );
    
  return (
    <>
       <div className='tasklist-container'>
            <div className={isDarkmode? 'tasklist-header-dark':'tasklist-header'}>
                <div className='head-title'>
                <h1>Tasks</h1>
                <Button onClick={handleShow} style={{backgroundColor:'transparent', borderStyle:'none',display:'flex', alignItems:'center',}}>
                        <div className='sort-buttons'><img src={isDarkmode? AddBlueIcon: AddIcon} alt='add icon' width='30px'/></div>
                </Button>
                </div>
                <div className='user-action'>

                    <div className='sort-category'>
                        <select id="category" 
                            onChange={(e) => {
                                const selectedCategory = e.target.value;
                                filterCategory(selectedCategory);
                            }}
                        >
                            <option value=""></option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="study">Study</option>
                        </select>
                    </div>
                    <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={Mictip}>
                    {!listening ? (
                      <button
                        className="task-mic-button"
                        onClick={browserSupportsSpeechRecognition
                          ? SpeechRecognition.startListening
                          : () => notify("Browser doesn't support speech recognition.")}
                        style={{
                          backgroundColor: "transparent",
                          borderStyle: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img className="mic" src={MicIcon} alt="mic" width="20px" />
                      </button>
                    ) : (
                      <button
                        className="task-mic-button"
                        onClick={SpeechRecognition.stopListening}
                        style={{
                          backgroundColor: "transparent",
                          borderStyle: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img className="mic" src={StopIcon} alt="mic" width="20px" />
                      </button>
                    )}
                    </OverlayTrigger>
                    <div className='sort-buttons' >
                        {sort? <button onClick={()=>sortPrioAsc()}><img src={sortAscIcon}/></button>:<button onClick={() => sortPrioAsc()}><img src={SortDescIcon} alt='sort' /></button>}
                    </div>
                    <OverlayTrigger placement="left" delay={{ show: 250, hide: 400 }} overlay={archiveTooltip}>
                      <button style={{backgroundColor:'transparent', borderStyle:'none', display:'flex', alignItems:'center'}} onClick={()=>filterArchive('completed')} ><img src={ArhiveIcon} alt='archived' height='30px' /> </button>
                    </OverlayTrigger>
                    <div className='change-layout'>
                        {currentLayout? <img onClick={()=>changeLayout()} src={isDarkmode?CardLayoutIcon:LayoutIcon} alt="layout" width='25px'/>: <img onClick={()=>changeLayout()} src={isDarkmode? TableLayoutBlue: LayoutIcon2} alt="layout" width='25px'/>}
                    </div>
                </div>
            </div>
            {currentLayout? (
            <TaskTable
                taskslist={filteredTasks} 
                sortedTasks={sortedTasks}
                isDarkmode={isDarkmode}
                currentLayout={currentLayout}
                CompletedIcon={CompletedIcon}
                PendingIcon={PendingIcon}
                OverdueIcon={OverdueIcon}
                EditIcon={EditIcon}
                EditIconBlue={EditIconBlue}
                DeleteIcon={DeleteIcon}
                CheckIcon={CheckIcon}
                SchoolIcon={SchoolIcon}
                PersonalIcon={PersonalIcon}
                WorkIcon={WorkIcon}
                SaveIcon={SaveIcon}
                InfoIcon={InfoIcon}
            />
            ) : (
            <TaskCards
                taskslist={filteredTasks} 
                sortedtasks={sortedTasks}
                isDarkmode={isDarkmode}
                currentLayout={currentLayout}
                CompletedIcon={CompletedIcon}
                PendingIcon={PendingIcon}
                OverdueIcon={OverdueIcon}
                EditIcon={EditIcon}
                EditIconBlue={EditIconBlue}
                DeleteIcon={DeleteIcon}
                CheckIcon={CheckIcon}
                SchoolIcon={SchoolIcon}
                PersonalIcon={PersonalIcon}
                WorkIcon={WorkIcon}
                SaveIcon={SaveIcon}
                InfoIcon={InfoIcon}
            />
            )}
            <Toaster />
            <TaskForm show={show} handleClose={handleClose} />
        </div>
    </>
  )
}

export default TaskList