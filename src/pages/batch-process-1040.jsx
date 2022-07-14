import React from "react";
import { Meta } from "../layout/Meta";
import { Section } from "../layout/Section";
import { Footer } from "../templates/Footer";
import { Hero } from "../templates/Hero";
// import { Upload } from "../templates/Upload";
import { Config } from "../utils/Config";
import { useUser } from "../firebase/useUser";
import Head from "next/head";
// import UploadFile from "../components/storage/UploadFile";
// import Button from "react-bootstrap/Button";
import Firebaseloginclick from "../components/auth/FirebaseAuthButton";
import ProcessDocumentBatch from "../components/docai/processDocumentBatch";
import { ButtonLogout } from "../templates/ButtonLogout";

import parserData from "../data/parserData";

const BatchProcess = () => {
  const { user } = useUser();
  // const maxEntities = 15; // maximum # of entities to show

  const parserURL = parserData["1040"];

  // const [docAIResponse, setDocAIResponse] = useState(null);
  // const [fileResponse, setFileResponse] = useState(null);
  // const [firestoreProgress, setFirestoreProgress] = useState(null);
  // const [isAnalyzingDocument, setIsAnalyzingDocument] = useState(false); //react state variable to keep track of if call to parser is in progress

  // // TODO: Use or remove
  // console.log(firestoreProgress);

  // function processDocAIResponse(data) {
  //   console.log(data);
  //   setDocAIResponse(data);
  // }

  // function processFireStoreProgress(data) {
  //   setFirestoreProgress(data);
  // }

  // function processFile(fileData) {
  //   // console.log("fileData", fileData);
  //   setFileResponse(fileData);
  // }

  // function processAnalyzingDocument(status) {
  //   setIsAnalyzingDocument(status);
  // }

  // const entityList = docAIResponse?.document.entities
  //   .slice(0, maxEntities)
  //   .map((data, i) => {
  //     return (
  //       <div key={"entity_row" + i} className="mb-1   ">
  //         <span className="font-semibold text-gray-800 inline-block p-1 bg-gray-300 px-2 rounded mr-2 ">
  //           {" "}
  //           {data.type}{" "}
  //         </span>
  //         <span className=" inline-block  "> {data.mentionText} </span>
  //       </div>
  //     );
  //   });

  if (user) {
    return (
      <div className="antialiased text-gray-600">
        {user && (
          <div>
            <Meta title={Config.title} description={Config.description} />
            <Hero />

            <Section
              title="Batch 1040 Form Processing"
              description="Select multiple .pdf, .jpeg or .png files"
            >
              <div className="  ">
                <div className="p-4  md:w-auto  border-gray-400 rounded border-4 border-opacity-3">
                  <ProcessDocumentBatch
                    parserURL={parserURL}
                    docType="1040-form"
                  />

                  {/* {firestoreProgress && <div>{firestoreProgress}</div>} */}

                  {/* {fileResponse &&
                    (fileResponse.fileType == "image/jpeg" ||
                      fileResponse.fileType == "image/png") && (
                      <div className="mt-4">
                        <img
                          className="rounded "
                          src={URL.createObjectURL(fileResponse.file)}
                        />
                      </div>
                    )}

                  {fileResponse && fileResponse.fileType == "application/pdf" && (
                    <div className="mt-4 w-full h-full">
                      <object
                        className="w-full h-full"
                        width="100%"
                        data="your_url_to_pdf"
                        type="application/pdf">
                        <embed
                          className="w-full rounded"
                          height={400}
                          src={URL.createObjectURL(fileResponse.file)}
                          type="application/pdf"
                        />
                      </object>
                    </div>
                  )} */}
                  {/* {docAIResponse && (
                    <div>
                      <div className="mb-3">
                        <div className="mb-2 pb-1 text-gray-800 text-xl font-semibold border border-t-0 border-b-1 border-r-0  border-l-0 ">
                          {" "}
                          Extracted Entities{" "}
                        </div>

                        <div></div>
                        <div className="p-2 pb-1 border rounded">
                          {entityList}
                        </div>
                      </div>
                      <div className="">
                        <div className="mb-2 pb-1 text-gray-800 text-xl font-semibold border border-t-0 border-b-1 border-r-0  border-l-0 ">
                          {" "}
                          Parser JSON Response
                        </div>
                        <div className="border rounded p-4 h-32 overflow-x-hidden overflow-y-scroll">
                          {JSON.stringify(docAIResponse)}
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>

              {/* <ProcessDocument /> */}
              {/* <UploadFile /> */}
              <ButtonLogout />
            </Section>
            <Footer />
          </div>
        )}
      </div>
    );
  } else
    return (
      <div>
        {/* <p><a href="/auth">Log In!</a></p> */}

        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon1.ico" />
        </Head>

        <Firebaseloginclick></Firebaseloginclick>

        <footer></footer>
      </div>
    );
};

export default BatchProcess;
