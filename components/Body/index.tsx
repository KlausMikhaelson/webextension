"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./Body.module.css";
import { FaArrowUp } from "react-icons/fa6";
import { RiLinkM } from "react-icons/ri";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Body: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Get current tab information when popup opens
    // @ts-ignore
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // only get the domain name
        setCurrentUrl(new URL(tabs[0].url).hostname);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Tab Tracker</h1>
      <p className="text-sm">Currently tracking:</p>
      <p className="text-xs truncate">{currentUrl}</p>
    </div>
  );
};

// const Section: React.FC<{
//   icon?: string;
//   title: string;
//   description: string;
//   active?: boolean;
// }> = ({ title, description, active }) => {
//   return (
//     <div className={`${styles.section} ${active ? styles.active : ""}`}>
//       <div className={styles.iconWrapper}>
//         <RiLinkM strokeWidth={0.5} color="#f0933f" size={20} />
//       </div>
//       <div className={styles.sectionTextWrapper}>
//         <div className={styles.sectionTitle}>{title}</div>
//         <div className={styles.sectionDescription}>{description}</div>
//       </div>
//     </div>
//   );
// };

export default Body;
