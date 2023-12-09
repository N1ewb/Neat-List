import React,{useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/dbContext';

import './TaskCards.css'

const TaskCards = ({temp, taskslist}) => {
    const auth = useAuth();
    const db = useDB()
    const [tasksList, setTaskLists] = useState([])

    const handleDeleteTask = async (id) => {
        await db.deleteTask(id)
    }
    useEffect(() => {
        const getTaskList = async () => {
            try {
                setTaskLists(taskslist);
                const unsubscribe = db.subscribeToTasksChanges((updatedTasks) => {
                    setTaskLists(updatedTasks);
                });
                return () => unsubscribe(); 
            } catch (error) {
                db.notifyError(error);
            }
        };
        getTaskList();
    }, [taskslist]);

  return (
    <>
        <div className="task-cards-container">
        {tasksList? tasksList.map((task, index) =>
            task.user === auth.currentUser.uid ? (
            <div key={task.id} className="task-card">
                <h3>{task.name}</h3>
                <p>Category: {task.category}</p>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                
            </div>
            ) : null
        ):<div>Loading...</div>}
        </div>
    </>
  )
}

export default TaskCards