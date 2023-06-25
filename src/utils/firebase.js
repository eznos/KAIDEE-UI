import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyB1fbHA9_uHE-YCUGyvxAniD2ouZ2-UvFU",
  authDomain: "bsm-project-test.firebaseapp.com",
  projectId: "bsm-project-test",
  storageBucket: "bsm-project-test.appspot.com",
  messagingSenderId: "761641531950",
  appId: "1:761641531950:web:56a62b6c9dc9f57df13dbf",
};

//* Initialize Firebase
const app = initializeApp(firebaseConfig);

//* Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
