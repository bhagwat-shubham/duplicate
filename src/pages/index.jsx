import React from "react";
import { Meta } from "../layout/Meta";
import { Section } from "../layout/Section";
import { DemoMenu } from "../templates/DemoMenu";
import { Footer } from "../templates/Footer";
import { Hero } from "../templates/Hero";
import { Config } from "../utils/Config";
import Head from "next/head";
// import styles from '../styles/main.css'
// import WriteToCloudFirestore from "../components/cloudfirestore/write";
// import ReadDataFromCloudFirestore from "../components/cloudfirestore/read";
import { useUser } from "../firebase/useUser";
// import Counter from "../components/realtimeDatabase/Counter";
// import UploadFile from "../components/storage/UploadFile";
// import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Firebaseloginclick from "../components/auth/FirebaseAuthButton";
// import ProcessDocument from "../components/docai/docaiprocess";

export default function Index() {
  const { user, logout } = useUser();

  if (user) {
    return (
      <div>
        {/* the main page gets loaded here*/}
        <div className="antialiased text-gray-600">
          <Meta title={Config.title} description={Config.description} />
          <Hero />
          {/* <VerticalFeatures /> */}
          <Section
            title="Document AI"
            description="Choose any of the parsers get started."
          >
            <DemoMenu />

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                onClick={() => logout()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded inline-flex items-center mt-8"
              >
                Log Out
              </Button>
            </div>
          </Section>
          {/*  <Banner />*/}
          <Footer />
        </div>
        {/* *******************Main pagee ends here   */}
      </div>
    );
  } else
    return (
      <div>
        {/*  ********  Main page Header*/}
        <Meta title={Config.title} description={Config.description} />
        <Hero />
        {/* <p><a href="/auth">Log In!</a></p> */}

        <Head>
          <title>Doc AI Demo</title>
          <link rel="icon" href="/favicon1.ico" />
        </Head>

        <Firebaseloginclick></Firebaseloginclick>

        <footer></footer>

        <Footer />
      </div>
    );
}
