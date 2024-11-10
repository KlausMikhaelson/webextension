"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./Body.module.css";
import { FaArrowUp } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";
import ActiveIcon from "../../public/icons/active_status.png";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Body: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState("Test");
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(7);
  const [chatExists, setChatExists] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const checkUserIsLoggedIn = async () => {
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      console.log("User is logged in");
      return true;
    }

    return false;

    // const userProfile = await fetch("http://localhost:3000/api/user", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${userToken}`,
    //   },
    // });

    // if (userProfile.status === 200) {
    //   return true;
    // }
  };

  useEffect(() => {
    // Get current tab information when popup opens
    // @ts-ignore
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   if (tabs[0]) {
    //     // only get the domain name
    //     setCurrentUrl(new URL(tabs[0].url).hostname);
    //   }
    // });

    const verifyUserLogin = async () => {
      const isLoggedIn = await checkUserIsLoggedIn();
      setUserLoggedIn(isLoggedIn);
      console.log(`User is ${isLoggedIn ? "logged in" : "not logged in"}`);
    };

    verifyUserLogin();
  }, []);

  return (
    <div className="p-4">
      <p className={styles.title}>{currentUrl}</p>
      <p className={styles.description}>Some Meta Data.....</p>
      {userLoggedIn ? (
        <div className={styles.buttons}>
          <div className={styles.active_user_container}>
            <h3 className={styles.active_users_header}>
              {numberOfActiveUsers}
            </h3>
            <p className={styles.active_users_text}>Active Users</p>
            <img
              className={styles.active_users_icon}
              src={ActiveIcon.src}
              alt="Active Users"
            />
          </div>
          <div className={styles.active_user_container}>
            {chatExists ? (
              <h3 className={styles.active_users_header}>Go to Chat</h3>
            ) : (
              <h3 className={styles.active_users_header}>Create Chat</h3>
            )}
          </div>
        </div>
      ) : (
        <div
          // @ts-ignore
          className={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className={styles.loginContainer}>
            <div className={styles.email}>
              <label className={styles.label}>Enter your email</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={styles.input}
              />
            </div>
            <div className={styles.email}>
              <label className={styles.label}>Enter your password</label>
              <input
                type="password"
                placeholder="Password"
                className={styles.input}
              />
            </div>
            <button className={styles.loginButton}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
