import React, { useContext, createContext } from 'react';
import { addDoc, collection, deleteDoc, getDocs,onSnapshot,doc, updateDoc, orderBy, query, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';

const dbContext = createContext();

export function useDB() {
    return useContext(dbContext);
}

export const DBProvider = ({ children }) => {
    const tasksCollectionRef = collection(db, 'Tasks');  

    const addSuccess = () => toast('Task Added');
    const notifyError = (errorMessage) => toast(errorMessage)

    const AddTask = async (name, category, priority, deadline, Timestamp, status, userID) => {
        try {
            await addDoc(tasksCollectionRef, { name, category, priority, deadline, Timestamp, status,user: userID });
            addSuccess();
        } catch (error) {
            console.log(error)
            notifyError()
        }
    };

    const getTask = async () => {
        try {
          const tasksSnapshot = await getDocs(tasksCollectionRef);
          const tasks = tasksSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          return tasks
        } catch (error) {
          return notifyError(error)
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

      const markTaskComplete = async (id) => {
        try{
            const taskDocRef = doc(db, 'Tasks', id)
            const updatedDataRef = { status: true };
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
        const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
            const updatedTasks = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            callback(updatedTasks);
        });

        return unsubscribe;
    };
    const value = {
        AddTask,
        getTask,
        deleteTask,
        markTaskComplete,
        subscribeToTasksChanges,
        notifyError,
        editTableTd
    };

    return (
        <dbContext.Provider value={value}>
            {children}
            <Toaster />
        </dbContext.Provider>
    );
};
