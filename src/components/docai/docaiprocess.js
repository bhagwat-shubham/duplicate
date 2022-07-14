import React from "react";
import { useRef } from "react";
import { useUser } from "../../firebase/useUser";
// import { request } from "http";

import firebase from "firebase/app";
import "firebase/firestore";

const ProcessDocument = () => {
  const { user } = useUser();
    
  const inputEl = useRef(null);

  function uploadFile() {
    console.log("Can I still access the token? " + user.token);

    var file = inputEl.current.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      var result = reader.result;

      console.log(result);

      var requestBody = {};

      requestBody.rawDocument = {};

      requestBody.rawDocument.content = result.split(",")[1];

      requestBody.rawDocument.mimeType = result
        .split(",")[0]
        .split(";")[0]
        .split(":")[1];

      const requestOptions = {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },

        body: JSON.stringify(requestBody),
      };
      //OCR Parser
      fetch(
        `https://us-documentai.googleapis.com/v1/projects/458762808967/locations/us/processors/aefcda3ab71c69a7:process`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => putDocumentInFirebase(data, file));
    };
  }

  function putDocumentInFirebase(response, file) {
    console.log(response);

    try {
      var uniqueid = Date.now().toString();

      firebase
        .firestore()
        .collection(user.email)
        .doc(uniqueid)
        .set({
          name: user.name,
          email: user.email,
          time_stamp: firebase.firestore.Timestamp.fromDate(new Date()),
          fileInfo: { name: file.name, type: file.type },
          output: {
            document: response.document,
            humanReviewStatus: response.humanReviewStatus,
          },
        })
        .then(alert("Document was parsed and added to firebase"));
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <div style={{ margin: "5px 0" }}>
      <br />
      <input type="file" onChange={uploadFile} ref={inputEl} />
    </div>
  );
};

export default ProcessDocument;
