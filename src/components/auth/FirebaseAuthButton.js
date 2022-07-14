import { setAccessTokenCookie } from "../../firebase/userCookies";
import firebase from "firebase/app";
import React from "react";
import { Meta } from "../../layout/Meta";
import { Section } from "../../layout/Section";
import { Config } from "../../utils/Config";

const Firebaseloginclick = () => {
  const loginClick = () => {
    try {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/cloud-platform");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          var credential = result.credential;

          var token = credential.accessToken;

          // console.log(token);

          var user = result.user;
          user.token = token;

          setAccessTokenCookie(token);

          // console.log(token);
        })
        .catch((error) => {
          console.error(error)
          // var errorCode = error.code;
          // var errorMessage = error.message;

          // var email = error.email;

          // var credential = error.credential;
        });
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="antialiased text-gray-600">
      <Meta title={Config.title} description={Config.description} />

      <Section
        title="Document AI Demos for Public Sector"
        description="Log in with Google Account">
        <div>
          <button
            onClick={loginClick}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded inline-flex items-center">
            <span>Log In</span>
          </button>
        </div>
      </Section>
    </div>
  );
};

export default Firebaseloginclick;
