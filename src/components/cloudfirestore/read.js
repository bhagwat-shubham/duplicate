import React from "react";
import firebase from "firebase/app";
import 'firebase/firestore';

const ReadFromDataStore = () => {

    const readData = () => {

        try {
            
            firebase.
                firestore().
                collection('myCollection').
                doc('mydocument').
                onSnapshot((doc) =>{

                    console.log(doc.data());

                });

            alert('got the data');
                

        } catch (error) {
            console.log(error);
            alert(error);
        }

    }

    return (
        <button onClick = {readData}>Read from backend</button>
    )

}

export default ReadFromDataStore