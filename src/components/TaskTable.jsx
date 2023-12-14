import React, {useState, useEffect} from 'react'

import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/dbContext';

import './TaskTable.css'

const TaskTable = ({ 
    taskslist, 
    currentLayout,
     isDarkmode,
     CompletedIcon, 
     PendingIcon, 
     OverdueIcon,
     EditIcon,
     EditIconBlue,
     DeleteIcon,
     CheckIcon,
     SchoolIcon,
     PersonalIcon,
     WorkIcon,
     SaveIcon 
    
    }) => {

    const auth = useAuth()
    const db = useDB()
    const [editableCell, setEditableCell] = useState(null);
    const [tasksList, setTaskLists] = useState([])

    const handleEditTableTd = (index) => {
        setEditableCell(index); 
    };
    const saveEditedCellValue = async (id, cell, value) => {
        await db.editTableTd(id, cell, value)
        setEditableCell(null); 
      };

    const handleDeleteTask = async (id) => {
        await db.deleteTask(id)
        setEditableCell(null)
    }

    const handleMarkTaskComplete = async (id) => {
        db.markTaskComplete(id)
        setEditableCell(null)
    }

    const getPriorityString = (priority) => {
        switch (priority) {
            case '1':
                return 'Low';
            case '2':
                return 'High';
            case '3':
                return 'Critical';
            default:
                return '';
        }
    };

    const getCategoryImg = (category) => {
        switch (category) {
            case 'study':
                return SchoolIcon;
            case 'personal':
                return PersonalIcon;
            case 'work':
                return WorkIcon;
            default:
                return ''
        }
    }

    // const getFormattedDate = (timestamp) => {
    //     const milliseconds = timestamp * 1000;
    //     const dateObject = new Date(milliseconds);
    //     const formattedDate = dateObject.toISOString().split('T')[0];
      
    //     return formattedDate;
    //   };
      
      useEffect(() => {
        const getTaskList = async () => {
          try {
            if(currentLayout === 'table'){
                setTaskLists(taskslist);
                const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                    setTaskLists(taskslist);
                });
                return () => unsubscribe();
              
            }
          } catch (error) {
            db.notifyError(error); 
          } 
        };
        getTaskList();
       }, [taskslist, db,currentLayout]);
       
  return (
    <>
        <div className={isDarkmode? 'task-table-dark':'task-table'}>
        <div className="card-container">
            {tasksList ? (
                tasksList.map((task, index) =>
                task.user === auth.currentUser.uid ? (
                    <div key={task.id} className={isDarkmode?'card-dark':'card'}>

                    <div className="card-item status">
                    {editableCell === index? <button onClick={()=>handleMarkTaskComplete(task.id)}><img src={CheckIcon} alt='check' height='27px'/></button>: 
                        task.status === 'pending' ? (
                            <img src={PendingIcon} alt='pending' height='20px'/>
                        ) : task.status === 'completed' ? (
                            <img src={CompletedIcon} alt='Completed' height='20px'/>
                        ) : (
                            <img src={OverdueIcon} alt='overdue' height='20px'/>
                        )}
                    </div>

                    <div className="card-item-name">
                        {editableCell === index ? (
                            <input
                                type='text'
                                value={task.name}
                                onChange={(e) => {
                                e.preventDefault()
                                const newValue = e.target.value;
                                setTaskLists((prevTasks) =>
                                    prevTasks.map((t, i) =>
                                    i === index ? { ...t, name: newValue } : t
                                    )
                                );
                                }}
                                onBlur={(e) => {
                                    const newValue = e.target.value;
                                    saveEditedCellValue(task.id, 'name',newValue);
                                }}
                            />
                        ) : (
                            <span>{task.name}</span>
                        )}
                    </div>
                    
                    <div className={isDarkmode? 'card-item category-dark':'card-item category'}>
                        
                        {editableCell === index ? (
                            <select className="category" type='text' value={task.category}
                                onChange={(e) => {
                                    e.preventDefault();
                                    const newCategoryValue = e.target.value;
                                    setTaskLists((prevTasks) =>
                                        prevTasks.map((t, i) =>
                                            i === index ? { ...t, category: newCategoryValue } : t
                                        )
                                    );
                                }}
                                onBlur={(e) => {
                                    const newCategoryValue = e.target.value;
                                    saveEditedCellValue(task.id, 'category', newCategoryValue);
                                }}
                            >
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="study">Study</option>
                            </select>
                        ) : (
                            <img src={getCategoryImg(task.category)} alt={task.category} height='25px' />
                        )}
                    </div>

                    <div className='card-item priority' style={{ color: task.priority === '1' ? '#58d332' : task.priority === '2' ? '#E2BE00' : task.priority === '3' ? '#9D0000' : 'green' }} >
                        {editableCell === index? (
                        <select className="priority-lvl" type='number' value={task.priority}
                            onChange={(e) => {
                                e.preventDefault();
                                const newPriorityValue = e.target.value;
                                setTaskLists((prevTasks) =>
                                    prevTasks.map((t, i) =>
                                        i === index ? { ...t, priority: newPriorityValue} : t
                                    )
                                );
                            }}
                            onBlur={(e) => {
                                const newPriorityValue = e.target.value;
                                saveEditedCellValue(task.id, 'priority', newPriorityValue);
                            }}
                        >
                            <option type='number' value="1">Low</option>
                            <option type='number' value="2">High</option>
                            <option type='number' value="3">Critical</option>
                        </select>
                        ):
                        <div className='priority'>{task.status !== 'overdue'? <p>{getPriorityString(task.priority)}</p> : <p style={{color:'red'}}>Overdue</p> }<span style={{ backgroundColor: task.status !== 'overdue' ? (task.priority === '1' ? '#58d332' : task.priority === '2' ? '#E2BE00' : task.priority === '3' ? '#9D0000' : 'green') : 'red' }}></span>                        </div>
                        }
                    </div>

                    <div className='card-item-user-action'>
                    <div className='action-button delete-button'>
                        {editableCell === index || task.status === 'overdue'? <button onClick={()=>handleDeleteTask(task.id)}><img src={DeleteIcon} alt='Delete' height='23px'/></button>: <div></div>}
                    </div>
                    <div className={isDarkmode ? "action-button edit-button-dark": "action-button edit-button"}>
                        {task.status !== 'pending' ? <div></div> : (
                            (
                                editableCell === index ? (
                                    <button onClick={() => {setEditableCell(null); handleEditTableTd(null);}}><img src={SaveIcon} alt='save' height='20px'/></button>
                                ) : (
                                    <button onClick={() => setEditableCell(index)}><img src={isDarkmode? EditIconBlue: EditIcon} alt='edit-icon' height='30px'/></button>
                                )
                            )
                        )}
                    </div>
                    </div>
                    
                    </div>
                ) : null
                )
            ) : <div>Loading</div>}
            </div>

        </div>
    </>
  )
}

export default TaskTable