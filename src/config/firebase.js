import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBBgKLgOHgR2ruEqlyZxlr3XW6HkG_e_yw",
  authDomain: "new-blog-web-127b6.firebaseapp.com",
  projectId: "new-blog-web-127b6",
  storageBucket: "new-blog-web-127b6.firebasestorage.app",
  messagingSenderId: "42942176185",
  appId: "1:42942176185:web:68e34611e1e6b972247468",
  measurementId: "G-EW9H6JF9ZT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth