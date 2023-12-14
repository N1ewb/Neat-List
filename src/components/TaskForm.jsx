import React, { useRef } from 'react'
import { useDB } from '../context/dbContext'
import { useAuth } from '../context/AuthContext'
import { Timestamp } from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import './TaskForm.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import MicIcon from '../images/icons8-mic-48.png'
import StopIcon from '../images/icons8-stop-circled-50.png'

const TaskForm = ({show, handleClose}) => {
    const db = useDB()
    const auth = useAuth()
    const notifyError = (error) => toast(error)
    const taskNameRef = useRef()
    const categoryRef = useRef()
    const priorityRef = useRef()
    const deadlineDateRef = useRef()
    const deadlineTimeRef = useRef()
    const oneDayInMilliseconds = 1000 * 60 * 60 * 24;

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

      

    const handleAddTask = async () => {
        var taskName;
        if(transcript){
            taskName = transcript
        } else {
            taskName = taskNameRef.current.value;
        }
        const category = categoryRef.current.value;
        const priority = priorityRef.current.value;
        const dDate = deadlineDateRef.current.value;
        const dTime = deadlineTimeRef.current.value;
        
        if (taskName && category && priority && dDate && dTime) {
            const today = new Date(); 
            const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
            const yesterday = new Date(today.getTime() - oneDayInMilliseconds)
            const deadlineDate = new Date(dDate); 
            if (deadlineDate > yesterday) {
                resetTranscript()
                await db.AddTask(
                    taskName,
                    category,
                    priority,
                    deadlineDate,
                    dTime,
                    Timestamp.now(),
                    'pending',
                    auth.currentUser.uid
                );
            } else {
                notifyError('Deadline should be ahead of current date')
            }
        } else {
            notifyError('Please fill in the fields')
        }
    };
    

  return (
    <>
    <Toaster />
    <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='task-form'>
                    <div className='task-name-wrapper'>
                    {!listening ? 
                        <button className='mic-button' onClick={SpeechRecognition.startListening} style={{backgroundColor:'transparent', borderStyle:'none',display:'flex',alignItems:'center'}} ><img className='mic' src={MicIcon} alt='mic' width='20px' /></button> :
                        <button className='mic-button' onClick={SpeechRecognition.stopListening} style={{backgroundColor:'transparent', borderStyle:'none',display:'flex',alignItems:'center'}} ><img className='mic' src={StopIcon} alt='mic' width='20px' /></button>}
                        <input name='task-input' placeholder={transcript? transcript: 'Task Name'} ref={taskNameRef} />
                    </div>
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
                    <label htmlFor="deadline">Set Deadline Date:</label>
                    <input type="date" id="deadline" name="deadline" ref={deadlineDateRef}></input>
                    <label htmlFor="appt">Select Deadline time:</label>
                    <input type="time" id="appt" name="appt" ref={deadlineTimeRef}></input>
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