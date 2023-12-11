import React, { useContext, createContext } from 'react';
import { addDoc, collection, deleteDoc, getDocs,onSnapshot,doc, updateDoc,getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const dbContext = createContext();

export function useDB() {
    return useContext(dbContext);
}

export const DBProvider = ({ children }) => {
    const tasksCollectionRef = collection(db, 'Tasks');  
    const auth = useAuth()
    const addSuccess = () => toast('Task Added');
    const notifyError = (error) => toast(error.message);

    const AddTask = async (name, category, priority, deadlineDate, deadlineTime,Timestamp, status, userID) => {
        try {
            await addDoc(tasksCollectionRef, { name, category, priority, deadlineDate, deadlineTime,Timestamp, status,user: userID });
            addSuccess();
        } catch (error) {
            return notifyError(error)
        }
    };

        const getUserTask = async () => {
        try {
          if (auth.currentUser){
            const tasksSnapshot = await getDocs(tasksCollectionRef);
            const tasks = tasksSnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));

            const userTasks = tasks.filter((task) => task.user === auth.currentUser.uid);
            return userTasks;
          }
        } catch (error) {
          return notifyError(error);
        }
      };
      
      const deleteTask = async (id) => {
        try{
            const taskDoc = doc(db,'Tasks', id)
            return await deleteDoc(taskDoc)
        }catch(error){
            return notifyError(error)
        }
      }

      const markTaskOverdue = async (id) => {
        try {
          const tasksCollectionRef = collection(db, "Tasks");
          const emptyCollectionSnapshot = await getDocs(tasksCollectionRef);
      
          if (emptyCollectionSnapshot.empty) {
            return { message: "No tasks found in database" };
          }
          const taskDocRef = doc(db, "Tasks", id);
          const taskSnapshot = await getDoc(taskDocRef);
          
          if (!taskSnapshot.exists()) {
            return { message: "Task not found" };
          }
          const { status } = taskSnapshot.data();
          if (status === "overdue") {
            return { message: "Task is already overdue" };
          }
          await updateDoc(taskDocRef, {
            status: "overdue",
          });
          
        } catch (error) {
          return notifyError(error);
        }
      };

      const markTaskComplete = async (id) => {
        try{
            const taskDocRef = doc(db, 'Tasks', id )
            const updatedDataRef = { status: 'completed' };
            return await updateDoc(taskDocRef,updatedDataRef)
        }catch (error){
            return notifyError(error)
        }
      }

      const editTableTd = async (id, cell, value) => {
        try {
            const taskDocRef = doc(db, 'Tasks', id)
            const updatedDataRef = {[cell] : value}
            return  await updateDoc(taskDocRef, updatedDataRef);
        }catch(error){
            return notifyError(error)
        }
      }

      const subscribeToTasksChanges = (callback) => {
        if(auth.currentUser){
            const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
                const updatedTasks = snapshot.docs.map((doc) => ({
                  ...doc.data(),
                  id: doc.id,
                }));
                const updatedUserTask = updatedTasks.filter((task) => task.user === auth.currentUser.uid);
                callback(updatedUserTask);
              }, auth.currentUser.uid);
              return unsubscribe;
        }
      };
    const value = {
        AddTask,
        deleteTask,
        markTaskComplete,
        subscribeToTasksChanges,
        notifyError,
        editTableTd,
        getUserTask,
        markTaskOverdue
    };

    return (
        <dbContext.Provider value={value}>
            {children}
            <Toaster />
        </dbContext.Provider>
    );
};
