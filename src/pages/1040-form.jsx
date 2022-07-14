import React, { useState } from "react";
import { Meta } from "../layout/Meta";
import { Section } from "../layout/Section";
import { Footer } from "../templates/Footer";
import { Hero } from "../templates/Hero";
// import { Upload } from "../templates/Upload";
import { Config } from "../utils/Config";
import { useUser } from "../firebase/useUser";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Head from "next/head";
// import UploadFile from "../components/storage/UploadFile";
// import Button from "react-bootstrap/Button";
import Firebaseloginclick from "../components/auth/FirebaseAuthButton";
import ProcessDocument from "../components/docai/processDocument";
import { ButtonLogout } from "../templates/ButtonLogout";

import parserData from "../data/parserData";

export default function Index() {
  const { user } = useUser();
  const maxEntities = 20; // maximum # of entities to show

  const parserURL = parserData["1040"];

  const [docAIResponse, setDocAIResponse] = useState(null);
  const [fileResponse, setFileResponse] = useState(null);
  const [firestoreProgress, setFirestoreProgress] = useState(null);
  const [isAnalyzingDocument, setIsAnalyzingDocument] = useState(false); //react state variable to keep track of if call to parser is in progress

  // TODO: Use or remove
  console.log(firestoreProgress);

  function processDocAIResponse(data) {
    // console.log(data);
    setDocAIResponse(data);
  }

  function processFireStoreProgress(data) {
    setFirestoreProgress(data);
  }

  function processFile(fileData) {
    // console.log("fileData", fileData);
    setFileResponse(fileData);
  }

  function processAnalyzingDocument(status) {
    setIsAnalyzingDocument(status);
  }

  const entityList = docAIResponse?.document.entities
    .slice(0, maxEntities)
    .map((data, i) => {
      return (
        <div key={"entity_row" + i} className="mb-1   ">
          <span className="font-semibold text-gray-800 inline-block p-1 bg-gray-300 px-2 rounded mr-2 ">
            {" "}
            {data.type}{" "}
          </span>
          <span className=" inline-block  "> {data.mentionText} </span>
        </div>
      );
    });

  if (user) {
    return (
      <div className="antialiased text-gray-600">
        {user && (
          <div>
            <Meta title={Config.title} description={Config.description} />
            <Hero />

            <Section
              title="1040 Form Parser"
              description="Upload .pdf, .jpeg or .png files"
            >
              <div className="my-2">
                For batch processing click{" "}
                <a href="/batch-process-1040" className="underline">
                  here
                </a>
              </div>
              <div className="grid md:grid-cols-2  gap-10">
                <div
                  style={{ minHeight: "364px" }}
                  className="p-4  md:w-auto  border-gray-400  rounded border-4 border-opacity-3"
                >
                  <ProcessDocument
                    docAICallBack={processDocAIResponse}
                    fileCallBack={processFile}
                    fireStoreProgressCallback={processFireStoreProgress}
                    parserURL={parserURL}
                    analyzingDocCallBack={processAnalyzingDocument}
                    docType="1040-form"
                  />

                  {/* {firestoreProgress && <div>{firestoreProgress}</div>} */}

                  {fileResponse &&
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
                        type="application/pdf"
                      >
                        <embed
                          className="w-full rounded"
                          height={400}
                          src={URL.createObjectURL(fileResponse.file)}
                          type="application/pdf"
                        />
                      </object>
                    </div>
                  )}
                </div>
                <div className="p-4 md:w-auto border-gray-400 rounded border-4 border-opacity-3">
                  {isAnalyzingDocument && (
                    <div
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
                      Analyzing Document ..
                    </div>
                  )}

                  {docAIResponse && (
                    <div>
                      <div className="mb-3">
                        <div className="mb-2 pb-1 text-gray-800 text-xl font-semibold border border-t-0 border-b-1 border-r-0  border-l-0 ">
                          {" "}
                          Extracted Entities{" "}
                        </div>

                        {docAIResponse.humanReviewStatus.state ===
                          "IN_PROGRESS" && (
                          <div className="p-2 text-sm border my-2 border-red-500 rounded">
                            <span>
                              {" "}
                              The document is sent to Human-In-The-Loop for
                              review{" "}
                            </span>
                          </div>
                        )}
                        <div className="p-2 pb-1 border rounded">
                          {entityList}
                        </div>
                      </div>
                      <div className="">
                        <div className="mb-2 pb-1 text-gray-800 text-xl font-semibold border border-t-0 border-b-1 border-r-0  border-l-0 ">
                          {" "}
                          Parser JSON Response
                        </div>
                        <div className="border rounded h-56 overflow-x-hidden overflow-y-scroll">
                          <SyntaxHighlighter language="json" style={docco}>
                            {JSON.stringify(docAIResponse, undefined, 2)}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </div>
                  )}
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
}
