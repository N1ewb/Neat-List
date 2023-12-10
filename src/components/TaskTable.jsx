import React, {useState, useEffect} from 'react'

import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/dbContext';

import './TaskTable.css'

const TaskTable = ({ taskslist, currentLayout, CompletedIcon, PendingIcon,EditIcon }) => {
    const auth = useAuth()
    const db = useDB()
    const [editableCell, setEditableCell] = useState(null);
    const [tasksList, setTaskLists] = useState([])
    const [loading, setLoading] = useState(true);
    const [initialState, setInitialState] = useState(false)

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

    const getStatus = (status) => {
        switch(status) {
            case true:
                return 'Completed';
            case false:
                return 'Not Completed';
            default:
                return ''
        }
    }
    const getFormattedDate = (timestamp) => {
        const milliseconds = timestamp * 1000;
        const dateObject = new Date(milliseconds);
        const formattedDate = dateObject.toISOString().split('T')[0];
      
        return formattedDate;
      };
      
      useEffect(() => {
        if (taskslist && taskslist.length > 0) {
          setLoading(false); 
        }
      }, [taskslist]);
      
      useEffect(() => {
        const getTaskList = async () => {
          try {
            if(currentLayout === 'table'){
                setTaskLists(taskslist);
              if(!initialState){
                const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                    setTaskLists(updatedTasks);
                    setInitialState(true)
                });
                return () => unsubscribe();
              } else {
                const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                    setTaskLists(taskslist);
                });
                return () => unsubscribe();
              }
            }
          } catch (error) {
            db.notifyError(error); 
          } 
        };
        getTaskList();
       }, [taskslist, db,currentLayout]);
       
  return (
    <>
        <div className='task-table'>
        <div className="card-container">
            {tasksList ? (
                tasksList.map((task, index) =>
                task.user === auth.currentUser.uid ? (
                    <div key={task.id} className="card">

                    <div className="card-item status">
                        {task.status === false ? (
                            <img src={PendingIcon} alt='pending' height='20px'/>
                        ) : (
                            <img src={CompletedIcon} alt='Completed' height='20px'/>
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
                                    handleEditTableTd(null); 
                                }}
                            />
                        ) : (
                            <span>{task.name}</span>
                        )}
                    </div>
                    
                    <div className='card-item category'>Category: 
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
                                handleEditTableTd(null); 
                            }}
                        >
                            <option value=""></option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="study">Study</option>
                        </select>
                    ) : (
                        " " + task.category
                    )}
                    </div>

                    <div className='card-item' style={{ color: task.priority === '1' ? '#58d332' : task.priority === '2' ? '#E2BE00' : task.priority === '3' ? '#9D0000' : 'green' }} >
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
                                handleEditTableTd(null); 
                            }}
                        >
                            <option value=""></option>
                            <option type='number' value="1">Low</option>
                            <option type='number' value="2">High</option>
                            <option type='number' value="3">Critical</option>
                        </select>
                        ):
                        getPriorityString(task.priority)}
                    </div>

                    <div className='card-item-user-action'>
                    <div className='card-item mark-complete'>
                        {editableCell === index? <button onClick={()=>handleMarkTaskComplete(task.id)}>Check</button>: <div></div>}
                    </div>
                    <div className='card-item delete-button'>
                        {editableCell === index? <button onClick={()=>handleDeleteTask(task.id)}>Delete</button>: <div></div>}
                    </div>
                    <div className="card-item edit-button">
                        {task.status ? <div></div> : (
                            (
                                editableCell === index ? (
                                    <button onClick={() => {setEditableCell(null); handleEditTableTd(null);}}>Save</button>
                                ) : (
                                    <button onClick={() => setEditableCell(index)}><img src={EditIcon} alt='edit-icon' height='30px'/></button>
                                )
                            )
                        )}
                    </div>
                    </div>
                    
                    </div>
                ) : null
                )
            ) : null}
            </div>

        </div>
    </>
  )
}

export default TaskTable