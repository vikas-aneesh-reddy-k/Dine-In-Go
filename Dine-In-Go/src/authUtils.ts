// filepath: d:\project-bolt-sb1-7wuo3n57\Dineingo\src\authUtils.ts
import { sendSignInLinkToEmail, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase"; // Import Firebase auth instance

const actionCodeSettings = {
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  linkDomain: 'custom-domain.com'
};

export const sendSignInEmail = async (email: string) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    console.log("Sign-in email sent!");
    window.localStorage.setItem("emailForSignIn", email);
  } catch (error) {
    console.error("Error sending sign-in email:", error);
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};