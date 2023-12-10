import React, { useRef } from 'react'
import { useDB } from '../context/dbContext'
import { useAuth } from '../context/AuthContext'
import { Timestamp } from 'firebase/firestore'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './TaskForm.css'
import 'bootstrap/dist/css/bootstrap.min.css';
const TaskForm = ({show, handleClose}) => {
    const db = useDB()
    const auth = useAuth()
    const taskNameRef = useRef()
    const categoryRef = useRef()
    const priorityRef = useRef()
    const deadlineRef = useRef()
    
    const handleAddTask = () => {
        const taskName = taskNameRef.current.value;
        const category = categoryRef.current.value;
        const priority = priorityRef.current.value;
        const deadline = deadlineRef.current.value;

        if (taskName && category && priority && deadline) {
            const today = new Date(); 
            const deadlineDate = new Date(deadline); 
            if (deadlineDate > today) {
                db.AddTask(
                    taskName,
                    category,
                    priority,
                    deadline,
                    Timestamp.now(),
                    false,
                    auth.currentUser.uid
                );
            } else {
                db.notifyError('Deadline should be ahead of current date')
            }
        } else {
            db.notifyError('Please fill in the fields')
        }
    };
    

  return (
    <>
    <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='task-form'>
                <input name='task-input' placeholder='Your Task' ref={taskNameRef} />
                    <label htmlFor="category">Category</label>
                    <select id="category" ref={categoryRef}>
                        <option value=""></option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                    </select>
                    <label htmlFor="priority-lvl">Priority Level</label>
                    <select id="priority-lvl" ref={priorityRef}>
                        <option value=""></option>
                        <option type='number' value="1">Low</option>
                        <option type='number' value="2">High</option>
                        <option type='number' value="3">Critical</option>
                    </select>
                    <label htmlFor="deadline">Set Deadline:</label>
                <input type="date" id="deadline" name="deadline" ref={deadlineRef}></input>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" type="submit" onClick={()=>handleAddTask()}>
                Add Task
            </Button>
            </Modal.Footer>
        </Modal>
    
    </>
  )
}

export default TaskForm