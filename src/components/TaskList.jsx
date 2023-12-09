import React, {useState } from 'react'


import Button from 'react-bootstrap/Button';

import LayoutIcon from '../images/icons8-layout-50.png'
import LayoutIcon2 from '../images/icons8-layoutTable-50.png'

import TaskForm from './TaskForm'
import TaskTable from './TaskTable';

import './TaskList.css'
import TaskCards from './TaskCards';


const TaskList = ({tasksList, temp, sortedTasks}) => {
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [currentLayout, setCurrentLayout] = useState()
    
    const changeLayoutTable = () => {
        setCurrentLayout('table')
    }

    const changeLayoutCards = () => {
        setCurrentLayout('cards')
    }
  return (
    <>
       <div className='tasklist-container'>
            <div className='tasklist-header'>
                <h1>Tasks</h1>
                <div className='user-action'>
                <Button variant="primary" onClick={handleShow}>
                    Add Task
                </Button>
                    <div className='change-layout'>
                        {currentLayout === 'table'? <img onClick={()=>changeLayoutCards()} src={LayoutIcon} alt="layout" />: <img onClick={()=>changeLayoutTable()} src={LayoutIcon2} alt="layout" />}
                    </div>
                </div>
            </div>
            {currentLayout === "table"? <TaskTable temp={temp} taskslist={tasksList} sortedTasks={sortedTasks}/>: <TaskCards temp={temp} taskslist={tasksList} sortedTasks={sortedTasks}/>}
            <TaskForm show={show} handleClose={handleClose} />
        </div>
    </>
  )
}

export default TaskList