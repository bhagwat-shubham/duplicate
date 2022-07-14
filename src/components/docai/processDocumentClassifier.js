import React from "react";
import { useRef } from "react";
import { useUser } from "../../firebase/useUser";
// import { request } from "http";

import firebase from "firebase/app";
import "firebase/firestore";
import { logEvent } from "../../firebase/initFirebase";
// const automl = require("@google-cloud/automl");

// Create client for prediction service.
// const client = new automl.PredictionServiceClient();
// console.log(client);

/**
 *
 *  Component to process an uploaded document -
 *  uploadFile : upload local file, send to parser, get parsed JSON
 *  saveToFireStore: save parsed JSON in firestore
 *  putDocumentInFirebase: save uploaded file in Firebase storage.
 */

// async function main() {
//   const auth = new GoogleAuth({
//     scopes: "https://www.googleapis.com/auth/cloud-platform",
//   });
//   const client = await auth.getClient();
//   const projectId = await auth.getProjectId();
//   console.log("projectid => ", projectId);
//   // const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
//   // const res = await client.request({ url });
//   // console.log("** =>", res);
// }

// main().catch(console.error);

const ProcessDocumentClassifier = ({
  docAICallBack,
  fireStoreProgressCallback,
  classifierUrl,
  analyzingDocCallBack,
}) => {
  const { user } = useUser();

  const inputEl = useRef(null);

  function saveToFireStore(file) {
    // create a storage ref
    var storageRef = firebase.storage().ref("user_uploads/" + file.name);

    // upload file
    var task = storageRef.put(file);

    // update progress bar
    task.on(
      "state_change",
      function progress(snapshot) {
        fireStoreProgressCallback(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },

      function error(err) {
        console.log("firestore upload error", err);
      },

      function complete() {
        // alert("Uploaded to firebase storage successfully!");
      }
    );
  }

  function classifyDocument(imageb64, file) {
    const payLoad = {
      instances: [
        {
          content: imageb64.split(",")[1],
          mimeType: file.type,
        },
      ],
      parameters: {
        confidenceThreshold: 0.5,
        maxPredictions: 5,
      },
    };

    // console.log(payLoad);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify(payLoad, null, 2),
    };

    //Automl Prediction Call
    fetch(classifierUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // console.log("classif response", data);
        analyzingDocCallBack(false);

        docAICallBack(data);
        // putDocumentInFirebase(data, file);
        const eventData = {
          type: file.type,
          mimeType: file.type,
        };
        logEvent("doc_classification", eventData);
      })
      .catch((error) => {
        analyzingDocCallBack(false);
        console.error(error);
      });
  }

  // function savetoGCS(file) {
  //   var data = new FormData();
  //   data.append("file", file);
  //   const gcsUploadUrl =
  //     "https://storage.googleapis.com/upload/storage/v1/b/pubsec-doc-classification/o?uploadType=media&name=" +
  //     file.name;
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": file.type,
  //       Authorization: "Bearer " + user.token,
  //     },
  //     body: file,
  //   };

  //   //GCS Storage  Call
  //   fetch(gcsUploadUrl, requestOptions)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const gsUrl = "gs://" + data.bucket + "/" + data.name;
  //       classifyDocument(gsUrl, file);
  //     })
  //     .catch((error) => {
  //       analyzingDocCallBack(false);
  //       console.error(error);
  //     });
  // }

  function uploadFile() {
    // Only process if there is a selected file.
    if (inputEl.current.files.length > 0) {
      // Check if token is valid. if not, redirect to hompage
      if (!user.token) {
        window.location.href = "/";
      }
      var file = inputEl.current.files[0];

      analyzingDocCallBack(true);
      // write a copy of uploaded file to FireStore.
      saveToFireStore(file);

      // get uploaded image as base64 encoded string
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var imageb64 = reader.result;
        classifyDocument(imageb64, file);
      };
    }
  }

  // async function putDocumentInFirebase(response, file) {
  //   // console.log(response);

  //   try {
  //     var uniqueid = Date.now().toString();

  //     const firebaseResponse = await firebase
  //       .firestore()
  //       .collection(user.email)
  //       .doc(uniqueid)
  //       .set({
  //         name: user.name,
  //         email: user.email,
  //         time_stamp: firebase.firestore.Timestamp.fromDate(new Date()),
  //         fileInfo: { name: file.name, type: file.type },
  //         output: {
  //           document: response.document,
  //           humanReviewStatus: response.humanReviewStatus,
  //         },
  //       });
  //     console.log("Fire base response", firebaseResponse);
  //     // .then((data) => {
  //     //   console.log("Firebase response:", data);
  //     // });
  //   } catch (error) {
  //     console.log(error);
  //     alert(error);
  //   }
  // }

  return (
    <div>
      <input
        className="bg-gray-300 hover:bg-gray-400 w-full text-gray-800 font-boldp p-3 rounded inline-flex "
        type="file"
        onChange={uploadFile}
        ref={inputEl}
      ></input>
    </div>
  );
};

export default ProcessDocumentClassifier;
