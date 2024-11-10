"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./Body.module.css";
import { FaArrowUp } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";
import ActiveIcon from "../../public/icons/active_status.png";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Tab {
  id: number;
  url: string;
  title: string;
  active: boolean;
}

const Body: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState("Test");
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(7);
  const [chatExists, setChatExists] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);

  const checkUserIsLoggedIn = async () => {
    return new Promise((resolve: any) => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get("userToken", (result) => {
          const userToken = result.userToken;
          if (userToken) {
            console.log("User is logged in", userToken);
            setUserLoggedIn(true);
          } else {
            setUserLoggedIn(false);
          }
        });
      }
    });
  };

  const handleLogin = async () => {
    if (email && password) {
      const userToken = email;
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ userToken }, () => {
          console.log("User token saved to Chrome storage");
          localStorage.setItem("userToken", userToken);
          console.log("User token saved to browser's localStorage");
          alert("Login successful");
          setUserLoggedIn(true);
        });
      } else {
        alert("Chrome storage not found");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  const getAllTabs = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        const tabList = tabs.map(tab => ({
          id: tab.id || 0,
          url: tab.url || "",
          title: tab.title || "",
          active: tab.active || false,
          ...tab
        }));
        console.log("All open tabs:", tabList);
    // TODO: send the data to the server
        setOpenTabs(tabList);
      });
    }
  };

  useEffect(() => {
    const verifyUserLogin = async () => {
      const isLoggedIn: any = await checkUserIsLoggedIn();
      setUserLoggedIn(isLoggedIn);
      console.log(`User is ${isLoggedIn ? "logged in" : "not logged in"}`);
    };

    verifyUserLogin();
    getAllTabs(); // Get initial list of tabs

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Current tab:", tabs);
      const currentTab = tabs[0];
      if (currentTab) {
        // @ts-ignore
        setCurrentUrl(currentTab.url || "");
      }
    });

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.active && changeInfo.url) {
      chrome.storage.local.set({ [`EndTimeStamp-${changeInfo.url}`]: new Date().getTime() }, () => {
        setCurrentUrl(changeInfo.url || "");
      });
      getAllTabs(); // Refresh tab list when any tab is updated
    }});

    // Listen for tab creation/removal
    chrome.tabs.onCreated.addListener(() => getAllTabs());
    chrome.tabs.onRemoved.addListener(() => getAllTabs());

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "activeUsers") {
        console.log("Active users", request.data);
        setNumberOfActiveUsers(request.data);
      }
    });

    chrome.runtime.sendMessage({ message: "getActiveUsers" }, (response) => {
      setNumberOfActiveUsers(response.data);
    });

    chrome.runtime.sendMessage({ message: "checkChatExists" }, (response) => {
      setChatExists(response.data);
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === "chatExists") {
        setChatExists(request.data);
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener((request, sender, sendResponse) => {
        if (request.message === "activeUsers") {
          setNumberOfActiveUsers(request.data);
        }
      });

      chrome.runtime.onMessage.removeListener((request, sender, sendResponse) => {
        if (request.message === "chatExists") {
          setChatExists(request.data);
        }
      });
    };
  }, []);

  useEffect(() => {
    const getCurrentTabsTimeStamps = async () => {
      const allTabs = await getAllTabs();
      // if (allTabs) return;
      // @ts-ignore
      allTabs.forEach(async (tab) => {
        const timeStamp = await chrome.storage.local.get(`EndTimeStamp-${tab.url}`);
        console.log(`End Time Stamp for ${tab.url}:`, timeStamp);
      });
    }

    getCurrentTabsTimeStamps();
  }, []);

  const convertEpochToReadableTime = (epochTime) => {
    // Check if the epoch time is in milliseconds and convert to seconds if needed
    const isMilliseconds = epochTime > 9999999999;
    const date = new Date(isMilliseconds ? epochTime : epochTime * 1000);
  
    // Format the date and time as a human-readable string
    const readableTime = date.toLocaleString();
  
    return readableTime;
  };

  return (
    <div className="p-4">
      <p className={styles.title}>{currentUrl}</p>
      <p className={styles.description}>Some Meta Data.....</p>
      {userLoggedIn ? (
        <div>
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
          
          {/* Open Tabs Section */}
          <div className={styles.tabsSection}>
            <h3 className={styles.tabsHeader}>Open Tabs ({openTabs.length})</h3>
            <div className={styles.tabsList}>
              {openTabs.map((tab) => (
                <div 
                  key={tab.id} 
                  className={`${styles.tabItem} ${tab.active ? styles.activeTab : ''}`}
                >
                  <p className={styles.tabTitle}>{tab.title}</p>
                  <p className={styles.tabUrl}>{tab.url}</p>
                  {/* @ts-ignore */}
                  <p className={styles.tabUrl}>{convertEpochToReadableTime(tab.lastAccessed)}</p>
                  {/* @ts-ignore */}
                  <img src={tab.favIconUrl} alt="Favicon" className={styles.favicon} />
                </div>
              ))}
            </div>
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