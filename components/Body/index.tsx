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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkUserIsLoggedIn = async () => {
    return new Promise((resolve: any) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get("userToken", (result) => {
          const userToken = result.userToken;
          if (userToken) {
            console.log("User is logged in");
            setUserLoggedIn(true);
          } else {
            setUserLoggedIn(false);
          }
        });
      }
    });
  };

  const handleLogin = async () => {
    // Mock login validation; replace with actual API call
    if (email === "asd" && password === "asd") {
      const userToken = "mockToken123"; // Replace with token from API response
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ userToken }, () => {
          console.log("User token saved to local storage");
          alert("Success");
          setUserLoggedIn(true);
        });
      } else {
        alert("Chrome storage not found");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  useEffect(() => {
    const verifyUserLogin = async () => {
      const isLoggedIn: any = await checkUserIsLoggedIn();
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
          style={{
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.email}>
              <label className={styles.label}>Enter your password</label>
              <input
                type="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;