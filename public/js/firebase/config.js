// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBMZgHWJCfj_EAIkL6upqi_MrMpCqCL_w",
  authDomain: "app-peliculas-5e74a.firebaseapp.com",
  projectId: "app-peliculas-5e74a",
  storageBucket: "app-peliculas-5e74a.appspot.com",
  messagingSenderId: "1076435550867",
  appId: "1:1076435550867:web:4b7b1c16b0835c84ba8366",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const db_name = "stream";
const db_name_2 = "stream_chat";
const db_name_3 = "stream_emoji";

const Params = new URLSearchParams(window.location.search)

const addStream = (data) => {
  addDoc(collection(db, db_name), data);
};

const getStream = (id = "") => {
  if (id === "") return getDocs(collection(db, db_name));
  else return getDoc(doc(db, db_name, id));
};

const dropStream = (id = false) => {
  if (id) {
    deleteDoc(doc(db, db_name, id));
  }
};

const updateStream = (id, data) => {
  updateDoc(doc(db, db_name, id), data);
};
 
const onGetStream = (callback) => {
  if (typeof callback === "function") {
    const query2 = query(collection(db, db_name), limit(20));
    //onSnapshot(collection(db, db_name), callback);
    const unsubscribe = onSnapshot(query2, callback);
    return unsubscribe
  }
};

const onGetStreamChat = (callback) => {
  if (typeof callback === "function") {
    const query2 = query(collection(db, db_name_2), orderBy("datetime_add", "desc"), limit(5));
    //onSnapshot(collection(db, db_name_2), callback);
    const unsubscribe = onSnapshot(query2, callback);
    return unsubscribe
  } 
};

const addStreamChat = (data) => {
  addDoc(collection(db, db_name_2), data);
};

const updateStreamcChat = (id, data) => {
  updateDoc(doc(db, db_name_2, id), data);
};

const addStreamEmoji = (data) => {
  addDoc(collection(db, db_name_3), data);
};

const onGetStreamEmoji = (callback, id) => {
    if (typeof callback === "function") {
        const query2 = query(collection(db, db_name_3), where("id_stream", "==", id), orderBy("datetime_add", "desc"), limit(1));
        onSnapshot(query2, callback); 
    }
};
 
const onGetStreamID = (callback, id) => {
  if (typeof callback === "function") {
    const query2 = query(collection(db, db_name), where("id", "==", id), limit(1));
    //onSnapshot(collection(db, db_name), callback);
    const unsubscribe = onSnapshot(query2, callback); 
    return unsubscribe
  }
};
 
export {
  addStream,
  getStream,
  onGetStream,
  dropStream,
  updateStream,
  onGetStreamChat,
  addStreamChat,
  updateStreamcChat,
  addStreamEmoji,
  onGetStreamEmoji,
  onGetStreamID
};
