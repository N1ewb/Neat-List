import React, { useEffect, useState } from 'react'
import { DBProvider, useDB } from '../context/dbContext'
import { useAuth } from '../context/AuthContext'


import './TaskList.css'

const TaskList = () => {
    const db = useDB()
    const auth = useAuth()
    const [tasksList, setTaskLists] = useState([])
    const [editableCell, setEditableCell] = useState(null);
    const [sort, setSort] = useState('')

    const handleGetTasks = async () => {
        const tasks = await db.getTask()
        setTaskLists(tasks)
    };

    const sortPrioAsc = async () => {
        

        setSort('sortedAsc')
    }

    const sortPrioDesc = () => {
        setSort('sortedDesc')
    }
    
    const handleEditTableTd = (index) => {
        setEditableCell(index); 
    };
    const saveEditedCellValue = (id, cell, value) => {
        db.editTableTd(id, cell, value)
        setEditableCell(null); 
      };

    const handleDeleteTask = async (id) => {
        db.deleteTask(id)
    }

    

    const handleMarkTaskComplete = async (id) => {
        db.markTaskComplete(id)
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
    
    useEffect(()=>{
        handleGetTasks();
        const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
            setTaskLists(updatedTasks);
        });
        return () => unsubscribe();
    },[db])

  return (
    <>
        <DBProvider>
       <div className='tasklist-container'>
            <h1>Tasks</h1>
        <table className='task-table'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Priority {sort == 'sortedAsc'? <button onClick={()=>sortPrioDesc()}>△</button>:<button onClick={() => sortPrioAsc()}>▽</button>}</th>
                        <th>DeadLine</th>
                        <th>Date Created</th>
                        <th>Status</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                {tasksList.map((task,index) => (
                (task.user === auth.currentUser.uid) ? (
                    <tr key={task.id}>
                        {task.status === false ? (
                                <td><button onClick={() => handleMarkTaskComplete(task.id)}>✔</button></td>
                            ) : (
                                <td>✔</td>
                            )}
                        <td name='name' onClick={() => handleEditTableTd(index)}>
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
                        </td>
                        <td>{task.category}</td>
                        <td>{getPriorityString(task.priority)}</td>
                        <td>{task.deadline}</td>
                        <td>{getFormattedDate(task.Timestamp.seconds)}</td>
                        <td>{getStatus(task.status)}</td>
                        <td>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </td>
                        <td><button onClick={()=>handleEditTableTd()}>Edit</button></td>
                    </tr>
                    ) : (
                        null 
                        )
                    ))}
                </tbody>
            </table>
        </div>
        </DBProvider>
    </>
  )
}

export default TaskList