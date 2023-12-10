import React, {useState,useEffect,useCallback } from 'react'
import { useDB } from '../context/dbContext';

import Button from 'react-bootstrap/Button';

import LayoutIcon from '../images/card-layout.png'
import LayoutIcon2 from '../images/table-layout.png'
import AddIcon from '../images/icons8-add-50.png'
import CatergoryIcon from '../images/icons8-category-40.png'
import PendingIcon from '../images/icons8-pending-50.png'
import CompletedIcon from '../images/icons8-task-completed-48.png'
import sortAscIcon from '../images/icons8-ascending-sorting-50.png'
import SortDescIcon from '../images/icons8-descending-sorting-50.png'
import EditIcon from '../images/icons8-edit-text-file-48.png'

import TaskForm from './TaskForm'
import TaskTable from './TaskTable';

import './TaskList.css'
import TaskCards from './TaskCards';
import { useAuth } from '../context/AuthContext';

const TaskList = ({search}) => {
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
    const [currentTasks, setCurrentTasks] = useState(0);
    const [temp, setTemp] = useState([]);

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
      }, [taskslist]);
    
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

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (auth.currentUser) {
              const tasks = await handleGetTasks(auth.currentUser.uid);
              setTaskLists(tasks);
              setTemp(tasks);
              setCurrentTasks(tasks.length);
              setSortedTasks([...tasks]);
            }
            const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
              setTaskLists(updatedTasks);
              setCurrentTasks(updatedTasks.length);
            });
            return () => unsubscribe();
          } catch (error) {
            db.notifyError(error);
          }
        };
        fetchData();
      }, [auth.currentUser, db, handleGetTasks]);
      
    useEffect(() => {
        if(search){
            searchTask(search);
        } else {
            setFilteredTasks(taskslist)
        }
     }, [search, searchTask]);

  return (
    <>
       <div className='tasklist-container'>
            <div className='tasklist-header'>
                <h1>Tasks</h1>
                <div className='user-action'>

                    <div className='sort-category'>
                        <img src={CatergoryIcon} alt="category" height='27px' width='auto'/> 
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
                    <Button onClick={handleShow} style={{backgroundColor:'transparent', borderStyle:'none',display:'flex', alignItems:'center', }}>
                        <img src={AddIcon} alt='add icon' width='25px'/>
                    </Button>
                    <div className='change-layout'>
                        {currentLayout === 'table'? <img onClick={()=>changeLayoutCards()} src={LayoutIcon} alt="layout" width='25px'/>: <img onClick={()=>changeLayoutTable()} src={LayoutIcon2} alt="layout" width='25px'/>}
                    </div>
                </div>
            </div>
            {currentLayout === "table" ? (
            <TaskTable
                taskslist={filteredTasks} 
                sortedTasks={sortedTasks}
                currentLayout={currentLayout}
                CompletedIcon={CompletedIcon}
                PendingIcon={PendingIcon}
                EditIcon={EditIcon}
            />
            ) : (
            <TaskCards
                taskslist={filteredTasks} 
                sortedtasks={sortedTasks}
                currentLayout={currentLayout}
                CompletedIcon={CompletedIcon}
                PendingIcon={PendingIcon}
                EditIcon={EditIcon}
            />
            )}

            <TaskForm show={show} handleClose={handleClose} />
        </div>
    </>
  )
}

export default TaskList