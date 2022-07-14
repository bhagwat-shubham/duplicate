import React, { useState } from "react";
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

const ProcessDocumentBatch = ({
  // docAICallBack,
  // fileCallBack,
  // fireStoreProgressCallback,
  parserURL,
  // analyzingDocCallBack,
  docType,
}) => {
  const { user } = useUser();
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [parseResults, setParseResults] = useState([]);

  const inputEl = useRef(null);

  function saveToFireStore(file) {
    // create a storage ref
    var storageRef = firebase.storage().ref("user_uploads/" + file.name);

    // upload file
    var task = storageRef.put(file);

    // update progress bar
    task.on(
      "state_change",
      function progress() {
        // fireStoreProgressCallback(
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // );
      },

      function error(err) {
        console.log("firestore upload error", err);
      },

      function complete() {
        // alert("Uploaded to firebase storage successfully!");
        // console.log("finished saving file", file.name);
      }
    );
  }

  function parseFile(file, numFiles) {
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
      console.log(requestBody.rawDocument.mimeType);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
        body: JSON.stringify(requestBody, null, 2),
      };

      //Doc Parser
      fetch(parserURL, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            throw data.error;
          }
          putDocumentInFirebase(data, file);
          const eventData = {
            type: docType,
            mimeType: data.document.mimeType,
          };
          logEvent("file_upload", eventData);
          var up = uploadedFiles;
          up.push(file.name);
          setUploadedFiles(up);

          var pr = parseResults;
          pr.push(data);
          setParseResults(pr);
          if (uploadedFiles.length === numFiles) {
            document.getElementById("uploadingbox").hidden = true;
            document.getElementById("uploadedbox").hidden = false;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
  }

  function uploadFile() {
    document.getElementById("uploadingbox").hidden = false;
    const numFiles = inputEl.current.files.length;
    setTotalFiles(inputEl.current.files.length);
    // Only process if there is a selected file.
    if (inputEl.current.files.length > 0) {
      // Check if token is valid. if not, redirect to hompage
      if (!user.token) {
        window.location.href = "/";
      }

      for (var i = 0; i < inputEl.current.files.length; i++) {
        var file = inputEl.current.files[i];
        // write a copy of uploaded file to FireStore.
        saveToFireStore(file);
        parseFile(file, numFiles);
      }
    }
  }
  // function parseEntities(response) {
  //   let doc = {};
  //   response.document.entities.forEach((e) => {
  //     doc[e.type] = e.mentionText;
  //   });
  //   return doc;
  // }
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
    // const entities =
    //   docType === "drivers-license"
    //     ? response.document
    //     : parseEntities(response);
    console.log(entities);
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
        multiple
      ></input>
      <div className="mt-2">
        <div
          hidden
          id="uploadingbox"
          type="button"
          className="bg-rose-600 mb-3  text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="animate-spin h-6 w-6 mr-3 inline"
            viewBox="0 0 24 24"
          >
            <path d="M11.501 4.025v-4.025h1v4.025l-.5-.025-.5.025zm-7.079 5.428l-3.884-1.041-.26.966 3.881 1.04c.067-.331.157-.651.263-.965zm5.995-5.295l-1.039-3.878-.967.259 1.041 3.883c.315-.106.635-.197.965-.264zm-6.416 7.842l.025-.499h-4.026v1h4.026l-.025-.501zm2.713-5.993l-2.846-2.845-.707.707 2.846 2.846c.221-.251.457-.487.707-.708zm-1.377 1.569l-3.48-2.009-.5.866 3.484 2.012c.15-.299.312-.591.496-.869zm13.696.607l3.465-2-.207-.36-3.474 2.005.216.355zm.751 1.993l3.873-1.038-.129-.483-3.869 1.037.125.484zm-3.677-5.032l2.005-3.472-.217-.125-2.002 3.467.214.13zm-1.955-.843l1.037-3.871-.16-.043-1.038 3.873.161.041zm3.619 2.168l2.835-2.834-.236-.236-2.834 2.833.235.237zm-9.327-1.627l-2.011-3.484-.865.5 2.009 3.479c.276-.184.568-.346.867-.495zm-4.285 8.743l-3.88 1.04.26.966 3.884-1.041c-.106-.314-.197-.634-.264-.965zm11.435 5.556l2.01 3.481.793-.458-2.008-3.478c-.255.167-.522.316-.795.455zm3.135-2.823l3.477 2.007.375-.649-3.476-2.007c-.116.224-.242.439-.376.649zm-1.38 1.62l2.842 2.842.59-.589-2.843-2.842c-.187.207-.383.403-.589.589zm2.288-3.546l3.869 1.037.172-.644-3.874-1.038c-.049.218-.102.434-.167.645zm.349-2.682l.015.29-.015.293h4.014v-.583h-4.014zm-6.402 8.132l1.039 3.879.967-.259-1.041-3.884c-.315.106-.635.197-.965.264zm-1.583.158l-.5-.025v4.025h1v-4.025l-.5.025zm-5.992-2.712l-2.847 2.846.707.707 2.847-2.847c-.25-.22-.487-.456-.707-.706zm-1.165-1.73l-3.485 2.012.5.866 3.48-2.009c-.185-.278-.347-.57-.495-.869zm2.734 3.106l-2.01 3.481.865.5 2.013-3.486c-.299-.149-.591-.311-.868-.495zm1.876.915l-1.042 3.886.967.259 1.04-3.881c-.33-.067-.65-.158-.965-.264z" />
          </svg>
          Uploading files
        </div>

        <div id="uploadedbox" hidden>
          {" "}
          Files uploaded{" "}
        </div>
        {/* <div>{parseResults.length}</div> */}
      </div>
    </div>
  );
};

export default ProcessDocumentBatch;
