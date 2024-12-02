import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvxoNzwT5sFcExra5XZqpeoD_RK0QfnJw",
  authDomain: "leetclub-15cf9.firebaseapp.com",
  projectId: "leetclub-15cf9",
  storageBucket: "leetclub-15cf9.firebasestorage.app",
  messagingSenderId: "336912439047",
  appId: "1:336912439047:web:a17a7b9590a5fc51ac97a2",
  measurementId: "G-T5X4JHMK68"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export default app