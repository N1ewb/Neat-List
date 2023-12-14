import React,{useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext';
import { useDB } from '../context/dbContext';
import { Button } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './TaskCards.css'

const TaskCards = ({taskslist,
    currentLayout, 
    isDarkmode,
    PendingIcon, 
    CompletedIcon,
    EditIcon,
    EditIconBlue,
    DeleteIcon,
    CheckIcon,
    SchoolIcon,
    PersonalIcon,
    WorkIcon,
    SaveIcon,
    OverdueIcon,
    InfoIcon
    }) => {
    const auth = useAuth();
    const db = useDB()
    const [tasksList, setTaskLists] = useState([])
    const [editableCell, setEditableCell] = useState(null);

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
    const getFormattedDate = (timestamp) => {
        const milliseconds = timestamp * 1000;
        const dateObject = new
       
      Date(milliseconds);
        return dateObject.toLocaleDateString();
      };
      
    useEffect(() => {
        const getTaskList = async () => {
          try {
            if(!currentLayout){
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
       const popover = (task) => (
        <Popover id={`popover-${task.id}`}>
          <Popover.Header as="h3">{task.name}</Popover.Header>
          <Popover.Body>
            <p>Category: {task.category}</p>
            <p>Priority: {getPriorityString(task.priority)}</p>
            <p>Date Created: {getFormattedDate(task.Timestamp.seconds)}</p>
            <p>Deadline Date: {getFormattedDate(task.deadlineDate.seconds)} </p>
            <p>Deadline Time: {task.deadlineTime}</p>
            <p>Status: {task.status}</p>
          </Popover.Body>
        </Popover>
        );
  return (
    <>
        <div className={isDarkmode? 'task-cards-container-dark':'task-cards-container'}>
        <div className="task-cards">
            {tasksList ? (
                tasksList.map((task, index) =>
                task.user === auth.currentUser.uid ? (
                    <div key={task.id} className={isDarkmode?'task-card-dark':'task-card'} style={{backgroundColor:task.status === 'overdue'?'#FF8282':'#fafafa'}}>
                    <div className='card-head'>
                        <div className='card-tem-info'>
                            <OverlayTrigger placement="top" overlay={popover(task)}>
                                <Button style={{backgroundColor:'transparent',borderStyle:'none', display:'flex', alignItems:'center'}} variant="success"><img src={InfoIcon} alt='more infon' width='20px'/></Button>
                            </OverlayTrigger>
                        </div>
                        <div className="item-card-status">
                        {editableCell === index? <button onClick={()=>handleMarkTaskComplete(task.id)}><img src={CheckIcon} alt='check' height='27px'/></button>: 
                            task.status === 'pending' ? (
                                <img src={PendingIcon} alt='pending' height='20px'/>
                            ) : task.status === 'completed' ? (
                                <img src={CompletedIcon} alt='Completed' height='20px'/>
                            ) : (
                                <img src={OverdueIcon} alt='overdue' height='20px'/>
                            )}
                        </div>
                    </div>
                    <div className="item-card-name">
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
                    
                    <div className='sortables'>

                    <div className={isDarkmode? 'item-card category-dark':'item-card category'}>
                        
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

                    <div className='item-card priority' style={{ color: task.priority === '1' ? '#58d332' : task.priority === '2' ? '#E2BE00' : task.priority === '3' ? '#9D0000' : 'green' }} >
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

                    </div>

                    <div className='item-card-user-action'>
                    
                    <div className='card-action-button card-delete-button'>
                        {editableCell === index || task.status === 'overdue'? <button onClick={()=>handleDeleteTask(task.id)}><img src={DeleteIcon} alt='Delete' height='23px'/></button>: <div></div>}
                    </div>
                    <div className={isDarkmode ? "card-action-button card-edit-button-dark": "card-action-button card-edit-button"}>
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

export default TaskCards