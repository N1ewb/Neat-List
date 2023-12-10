import React,{useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/dbContext';

import './TaskCards.css'

const TaskCards = ({taskslist,currentLayout, PendingIcon, CompletedIcon}) => {
    const auth = useAuth();
    const db = useDB()
    const [tasksList, setTaskLists] = useState([])
    const [editableCell, setEditableCell] = useState(null);
    const [initialState, setInitialState] = useState(false)

    const handleEditTableTd = (index) => {
        setEditableCell(index); 
    };
    const saveEditedCellValue = async (id, cell, value) => {
        await db.editTableTd(id, cell, value)
        setEditableCell(null); 
      };
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
    const handleDeleteTask = async (id) => {
        await db.deleteTask(id)
    }
    const handleMarkTaskComplete = async (id) => {
        db.markTaskComplete(id)
    }
    
    useEffect(() => {
        const getTaskList = async () => {
          try {
            if(currentLayout === 'cards'){
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
        <div className="task-cards-container">
        {tasksList? tasksList.map((task, index) =>
            task.user === auth.currentUser.uid ? (
            <div key={task.id} className="task-card">
                <div className="card-item">
                    {task.status === false ? (
                        <img src={PendingIcon} alt='pending' width='20px'/>
                    ) : (
                        <img src={CompletedIcon} alt='Completed' width='20px'/>
                    )}
                </div>

                <div className="card-item">
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
                        task.name
                    )}
                </div>
                    
                <div className='card-item category'>Category: 
                {editableCell === index ? (
                    <select id="category" type='text' value={task.category}
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

                <div className='card-item' style={{ color: task.priority === '1' ? 'green' : task.priority === '2' ? 'yellow' : task.priority === '3' ? 'red' : 'green' }} >
                    {editableCell === index? (
                    <select id="priority-lvl" type='number' value={task.priority}
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

                <div className="card-item edit-button">
                    {task.status ? <div></div> : (
                        (
                            editableCell === index ? (
                                <button onClick={() => {
                                setEditableCell(null);
                                handleEditTableTd(null);
                                }}>Save</button>
                            ) : (
                                <button onClick={() => setEditableCell(index)}>Edit</button>
                            )
                        )
                    )}
                </div>
                
            </div>
            ) : null
        ):<div>Loading...</div>}
        </div>
    </>
  )
}

export default TaskCards