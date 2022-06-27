import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseDB = getFirestore(firebaseApp);
const drawingRef = collection(firebaseDB, 'drawings');

class Gallery {
  getDrawings(onUpdate) {
    const q = query(drawingRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      onUpdate(data);
    });
    return unsubscribe;
  }

  async addDrawing({ drawingID, thumbnail, drawing, design }) {
    await setDoc(doc(firebaseDB, 'drawings', drawingID), {
      thumbnail,
      drawing,
      design,
      createdAt: Timestamp.fromDate(new Date()),
    });
  }
}

export default Gallery;
