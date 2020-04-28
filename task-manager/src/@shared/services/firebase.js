import firebase from 'firebase/app';
import analytics from 'firebase/analytics';
import firestore from 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyDLLVsiQL_ca0bhBIxOnUhazBXlioQdfYM",
    authDomain: "task-manager-db866.firebaseapp.com",
    databaseURL: "https://task-manager-db866.firebaseio.com",
    projectId: "task-manager-db866",
    storageBucket: "task-manager-db866.appspot.com",
    messagingSenderId: "833037434358",
    appId: "1:833037434358:web:6d33732ea0f8bb59061bd7",
    measurementId: "G-M14L4FNZDW"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;