import React from "react";
import { useRef } from "react";
import { useUser } from "../../firebase/useUser";
// import { request } from "http";

import firebase from "firebase/app";
import "firebase/firestore";
import { logEvent } from "../../firebase/initFirebase";

/**
 *
 *  Component to process an uploaded document -
 *  uploadFile : upload local file, send to parser, get parsed JSON
 *  saveToFireStore: save parsed JSON in firestore
 *  putDocumentInFirebase: save uploaded file in Firebase storage.
 */

const ProcessDocument = ({
  docAICallBack,
  fileCallBack,
  fireStoreProgressCallback,
  parserURL,
  analyzingDocCallBack,
  docType,
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

  function uploadFile() {
    // Only process if there is a selected file.
    if (inputEl.current.files.length > 0) {
      // Check if token is valid. if not, redirect to hompage
      if (!user.token) {
        window.location.href = "/";
      }

      var file = inputEl.current.files[0];
      // console.log("file length", inputEl.current.files.length);

      // write a copy of uploaded file to FireStore.
      saveToFireStore(file);

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var result = reader.result;

        var requestBody = {};
        requestBody.rawDocument = {};
        requestBody.rawDocument.content = result.split(",")[1];
        requestBody.rawDocument.mimeType = result
          .split(",")[0]
          .split(";")[0]
          .split(":")[1];

        fileCallBack({
          file: file,
          fileType: requestBody.rawDocument.mimeType,
        });

        // console.log(requestBody.rawDocument.mimeType);
        const requestOptions = {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + user.token,
          },

          body: JSON.stringify(requestBody, null, 2),
        };

        //Doc Parser
        analyzingDocCallBack(true);
        fetch(parserURL, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            analyzingDocCallBack(false);
            if (data.error) {
              throw data.error;
            }
            docAICallBack(data);
            putDocumentInFirebase(data, file);
            const eventData = {
              type: docType,
              mimeType: data.document.mimeType,
            };
            logEvent("file_upload", eventData);
          })
          .catch((error) => {
            console.error(error);
          });
      };
    }
  }

  function parseEntities(response) {
    let doc = {};
    response.document.entities.forEach((e) => {
      doc[e.type] = e.mentionText || "";
    });
    return doc;
  }

  async function putDocumentInFirebase(response, file) {
    // console.log(response);

    const entities = parseEntities(response);
    // docType === "drivers-license"
    //   ? response.document
    //   : parseEntities(response);
    // console.log(entities);
    const docPayload = {
      name: user.name,
      email: user.email,
      time_stamp: firebase.firestore.Timestamp.fromDate(new Date()),
      file_name: file.name,
      file_type: file.type,
      doc: entities,
      humanReviewStatus: response.humanReviewStatus,
    };

    try {
      var uniqueid = Date.now().toString();

      const firebaseResponse = await firebase
        .firestore()
        .collection("doctype")
        .doc(docType)
        .collection("documents")
        .doc(uniqueid)
        .set(docPayload);

      const firebaseResponse2 = await firebase
        .firestore()
        .collection("users")
        .doc(user.email)
        .collection(docType)
        .doc(uniqueid)
        .set(docPayload);

      // console.log("Fire base response", firebaseResponse);
      // console.log("Fire base response", firebaseResponse2);
      // .then((data) => {
      //   console.log("Firebase response:", data);
      // });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

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

export default ProcessDocument;
