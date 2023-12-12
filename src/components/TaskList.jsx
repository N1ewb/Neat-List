import React, {useState,useEffect,useCallback } from 'react'
import { useDB } from '../context/dbContext';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import LayoutIcon from '../images/card-layout.png'
import CardLayoutIcon from '../images/card-layout-blue.png'
import LayoutIcon2 from '../images/table-layout.png'
import TableLayoutBlue from '../images/table-layout-blue.png'
import AddIcon from '../images/icons8-add-50.png'
import AddBlueIcon from '../images/icons8-add-blue-filled-50.png'
import CatergoryIcon from '../images/icons8-category-40.png'
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

import TaskForm from './TaskForm'
import TaskTable from './TaskTable';

import './TaskList.css'
import TaskCards from './TaskCards';
import { useAuth } from '../context/AuthContext';

const TaskList = ({search, isDarkmode}) => {
    const db = useDB()
    const auth = useAuth()
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [sort, setSort] = useState('')
    const [currentLayout, setCurrentLayout] = useState('table')
    const [taskslist, setTaskLists] = useState([]);
    const [sortedTasks, setSortedTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [temp, setTemp] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [overdueTasks, setOverdueTasks] = useState([]);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

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

    const changeLayoutTable = () => {
        setCurrentLayout('table')
    }

    const changeLayoutCards = () => {
        setCurrentLayout('cards')
    }
    
    const sortPrioAsc = () => {
      sortedTasks.sort((a, b) => a.priority - b.priority);
      setTaskLists(sortedTasks);
      setSort('sortedAsc')
        
    }

    const sortPrioDesc = () => {
      sortedTasks.sort((a, b) => b.priority - a.priority);
      setTaskLists(sortedTasks);
      setSort('sortedDesc') 
    }

    const handleMarkTaskOverdue = async () => {
      if (taskslist.length !== 0) {
        const currentTime = new Date().getTime();
        const today = new Date();
    
        const filteredOverdueTasks = taskslist.filter((task) => {
          const [deadlineHours, deadlineMinutes] = task.deadlineTime.split(':').map(Number);
          const deadlineDateTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            deadlineHours,
            deadlineMinutes
          ).getTime();
    
          return task.status === 'pending' && task.deadlineDate <= today && deadlineDateTime <= currentTime;
        });
    
        setOverdueTasks(filteredOverdueTasks);
    
        try {
          await Promise.all(filteredOverdueTasks.map((task) => db.markTaskOverdue(task.id)));
          if(overdueTasks.length !== 0){
            
            setOverdueTasks([]); 
          }
          
           
        } catch (error) {
          db.notifyError(error);
        }
      }
    };
    
    useEffect(() => {
      if(taskslist.length !== 0 && overdueTasks.length !== 0){
        handleMarkTaskOverdue();
      }
    }, [taskslist,overdueTasks]);

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

                    <div className='sort-buttons' >
                        {sort === 'sortedAsc'? <button onClick={()=>sortPrioDesc()}><img src={sortAscIcon}/></button>:<button onClick={() => sortPrioAsc()}><img src={SortDescIcon} alt='sort' /></button>}
                    </div>
                    <Dropdown style={{display:'flex',alignItems:'center'}}>
                      <Dropdown.Toggle  style={{backgroundColor:'transparent', borderStyle:'none',display:'flex',alignItems:'center'}}>
                      <div className='menu-button' id="dropdown-basic"><img src={MenuIcon} alt='menu' height='30px' /></div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu >
                        <Dropdown.Item ><img src={ArhiveIcon} alt='archived' height='30px' /> <span>Arhive</span></Dropdown.Item>
                        <Dropdown.Item ><img src={DeletedIcon} alt='deleted' height='30px' /> <span>Deleted</span></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <div className='change-layout'>
                        {currentLayout === 'table'? <img onClick={()=>changeLayoutCards()} src={isDarkmode?CardLayoutIcon:LayoutIcon} alt="layout" width='25px'/>: <img onClick={()=>changeLayoutTable()} src={isDarkmode? TableLayoutBlue: LayoutIcon2} alt="layout" width='25px'/>}
                    </div>
                </div>
            </div>
            {currentLayout === "table" ? (
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
            />
            )}

            <TaskForm show={show} handleClose={handleClose} />
        </div>
    </>
  )
}

export default TaskList