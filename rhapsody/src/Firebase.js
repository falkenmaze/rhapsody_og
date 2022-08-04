 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getStorage } from "firebase/storage"; 
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
const firebaseConfig = {

    apiKey: "AIzaSyBl4SjJjt6NRgsa2epvd98iq2rsAbJ4UKo",
  
    authDomain: "rhapsody-0121.firebaseapp.com",
  
    databaseURL: "https://rhapsody-0121-default-rtdb.asia-southeast1.firebasedatabase.app",
  
    projectId: "rhapsody-0121",
  
    storageBucket: "rhapsody-0121.appspot.com",
  
    messagingSenderId: "299641836045",
  
    appId: "1:299641836045:web:cd816e86b9fedcf7ce3b44",
  
    measurementId: "G-7H7VF9HERK"
  
  };
 
const firebaseapp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseapp)
const auth = getAuth(firebaseapp)
const storage = getStorage(firebaseapp)
export {db, auth, storage}
 