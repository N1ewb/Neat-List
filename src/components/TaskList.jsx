import React, { useCallback, useEffect, useState } from 'react'
import { DBProvider, useDB } from '../context/dbContext'
import { useAuth } from '../context/AuthContext'

import CatergoryIcon from '../images/icons8-category-50.png'

import './TaskList.css'

const TaskList = () => {
    const db = useDB()
    const auth = useAuth()
    const [tasksList, setTaskLists] = useState([])
    const [temp, setTemp] = useState()
    const [editableCell, setEditableCell] = useState(null);
    const [sort, setSort] = useState('')
    const sortedTasks = [...tasksList];

    const handleGetTasks = useCallback (async () => {
        const tasks = await db.getTask()
        setTemp(tasks)
        return tasks
        
    },[db]);
    
    const sortDeadlineAsc = () => {
        sortedTasks.sort((a, b) => {
            return new Date(a.deadline) - new Date(b.deadline);
        });
        setTaskLists(sortedTasks);
        setSort('deadlineAsc');
    };
    
    const sortDeadlineDesc = () => {
        sortedTasks.sort((a, b) => {
            return new Date(b.deadline) - new Date(a.deadline);
        });
        setTaskLists(sortedTasks);
        setSort('deadlineDesc');
    };

    const sortPrioAsc = async () => {
        sortedTasks.sort((a, b) => a.priority - b.priority);
        setTaskLists(sortedTasks);
        setSort('sortedAsc')
    }

    const sortPrioDesc = () => {
        sortedTasks.sort((a, b) => b.priority - a.priority);
        setTaskLists(sortedTasks);
        setSort('sortedDesc')
    }
    
    const sortCreatedAsc = async () => {
        sortedTasks.sort((a, b) => a.Timestamp- b.Timestamp);
        setTaskLists(sortedTasks)
        setSort('createdAsc')
    }

    const sortCreatedDesc = async () => {
        sortedTasks.sort((a, b) => b.Timestamp - a.Timestamp);
        setTaskLists(sortedTasks)
        setSort('createdDesc')
    }
    

    const filterCategory = async (category) => {
        if(category){
            const filtered = temp.filter(task => task.category === category);
            setTaskLists(filtered)
        } else {
            setTaskLists(temp)
        }
    };
    

    const handleEditTableTd = (index) => {
        setEditableCell(index); 
    };
    const saveEditedCellValue = async (id, cell, value) => {
        await db.editTableTd(id, cell, value)
        setEditableCell(null); 
      };

    const handleDeleteTask = async (id) => {
        await db.deleteTask(id)
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
    
      useEffect(() => {
        const fetchData = async () => {
            try {
                const tasks = await handleGetTasks();
                setTaskLists(tasks);
    
                const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                    setTaskLists(updatedTasks);
                });
                return () => unsubscribe();
            } catch (error) {
                db.notifyError(error)
            }
        };
    
        fetchData();
    }, [db, handleGetTasks]);
    

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
                        <th>Category <img src={CatergoryIcon} alt="category" height='20px' width='auto'/> 
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
                        </th>
                        <th>Priority {sort === 'sortedAsc'? <button onClick={()=>sortPrioDesc()}>△</button>:<button onClick={() => sortPrioAsc()}>▽</button>}</th>
                        <th>DeadLine {sort === 'deadlineAsc'? <button onClick={()=>sortDeadlineDesc()}>△</button>:<button onClick={() => sortDeadlineAsc()}>▽</button>}</th>
                        <th>Date Created  {sort === 'createdAsc'? <button onClick={()=>sortCreatedDesc()}>△</button>:<button onClick={() => sortCreatedAsc()}>▽</button>}</th>
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
                        <td onClick={() => handleEditTableTd(index)}>
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
                                task.category
                            )}
                        </td>
                        <td onClick={()=>{handleEditTableTd(index)}}>
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
                        </td>
                        <td>{task.deadline}</td>
                        <td>{getFormattedDate(task.Timestamp.seconds)}</td>
                        <td>{getStatus(task.status)}</td>
                        <td>
                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        </td>
                        <td>{editableCell === index ? (
                            <button onClick={() => {
                                setEditableCell(null);
                                handleEditTableTd(null)
                            }}>Save</button>
                            ) : (
                                <button onClick={() => setEditableCell(index)}>Edit</button>
                            )}
                        </td>
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