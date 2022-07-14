import React from "react";
import firebase from "firebase/app";
import 'firebase/firestore';

const WriteToCloudFireStore = () => {

    const sendData = () => {

        try {
            
            firebase.
                firestore().
                collection('myCollection').
                doc('mydocument').
                set({
                    name:'Ajay Prabhakar',
                    address:'1 River Rd, Schenectady, NY 12345, USA',
                    time_stamp: firebase.firestore.Timestamp.fromDate(new Date()),
                    tags:["notre dame", 'anna university', 'google','health tech','deloitte']
                }).then(
                    alert('Data was added')
                );

        } catch (error) {
            console.log(error);
            alert(error);
        }

    }

    return (
        <button onClick = {sendData}>Send to backend</button>
    )

}

export default WriteToCloudFireStore