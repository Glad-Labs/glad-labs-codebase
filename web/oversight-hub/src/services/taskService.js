import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

const tasksCollectionRef = collection(db, 'tasks');

/**
 * Fetches all tasks from the Firestore 'tasks' collection, ordered by creation date.
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
export const getTasks = async () => {
  try {
    const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to JS Date objects for easier use in components
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks: ', error);
    throw new Error('Could not fetch tasks from Firestore.');
  }
};

/**
 * Creates a new task document in the Firestore 'tasks' collection.
 * @param {object} taskData - The data for the new task.
 * @returns {Promise<string>} A promise that resolves to the new task's document ID.
 */
export const createTask = async (taskData) => {
  try {
    const docRef = await addDoc(tasksCollectionRef, {
      ...taskData,
      status: 'New', // Initial status for all new tasks
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating task: ', error);
    throw new Error('Could not create a new task in Firestore.');
  }
};

/**
 * Updates an existing task document in Firestore.
 * @param {string} taskId - The ID of the task to update.
 * @param {object} updates - An object containing the fields to update.
 * @returns {Promise<void>}
 */
export const updateTask = async (taskId, updates) => {
  try {
    const taskDocRef = doc(db, 'tasks', taskId);
    await updateDoc(taskDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task: ', error);
    throw new Error(`Could not update task ${taskId} in Firestore.`);
  }
};
